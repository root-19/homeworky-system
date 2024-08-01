const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const http = require('http'); 
const WebSocket = require('ws');

// Import the cron job
require('./cronjob');

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server with Express
const wss = new WebSocket.Server({ server }); // Create WebSocket server using the same HTTP server

const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet()); // Security headers

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(apiLimiter);

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User registration
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.query(sql, [username, hashedPassword, email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to register' });
    }

    const userId = results.insertId;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user_id: userId, token });
  });
});

// User login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT id,username, password FROM users WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to login' });
    }

    if (results.length === 0 || !bcrypt.compareSync(password, results[0].password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userId = results[0].id;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ user_id: userId, username: results[0].username, token });
  });
});

// Fetch assignments
app.get('/assignments', authenticateToken, (req, res) => {
  const userId = req.query.user_id;

  const sql = 'SELECT * FROM assignments WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch assignments' });
    }
    res.status(200).json(results);
  });
});

// Add assignment
app.post('/assignments', authenticateToken, (req, res) => {
  const { title, description, due_date, completed, user_id } = req.body;

  const sql = 'INSERT INTO assignments (title, description, due_date, completed, user_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, description, due_date, completed, user_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to add assignment' });
    }
    res.status(201).json({ id: results.insertId, title, description, due_date, completed, user_id });
  });
});

// Update assignment (toggle complete status)
app.put('/assignments/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const sql = 'UPDATE assignments SET completed = ? WHERE id = ?';
  db.query(sql, [completed, id], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update assignment' });
    }
    res.status(200).json({ id, completed });
  });
});

// Delete assignment
app.delete('/assignments/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM assignments WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete assignment' });
    }
    res.status(204).send();
  });
});



// Fetch messages
app.get('/messages', (req, res) => {
  db.query('SELECT * FROM messages ORDER BY dateCreated DESC', (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    res.json(results);
  });
});

// Post a message
app.post('/messages', (req, res) => {
  const { message } = req.body;
  if (message) {
    db.query('INSERT INTO messages (message) VALUES (?)', [message], (err) => {
      if (err) {
        console.error('Error inserting message:', err);
        res.status(500).json({ error: 'Database insert error' });
        return;
      }
      res.status(201).json({ message: 'Message added' });
    });
  } else {
    res.status(400).json({ error: 'Message text is required' });
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
