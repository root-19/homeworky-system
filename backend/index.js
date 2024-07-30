const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send reminder email
const sendReminderEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// User registration
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.query(sql, [username, password, email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'User registered' });
  });
});

// User login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = results[0];
    if (password !== user.password) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ token });
  });
});

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

// Add assignment
app.post('/assignments', authenticateToken, (req, res) => {
  const { title, description, due_date, user_id } = req.body;

  if (!title || !description || !due_date || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user exists
  db.query('SELECT id FROM users WHERE id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const sql = 'INSERT INTO assignments (title, description, due_date, user_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, description, due_date, user_id], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to add assignment' });
      }
      res.status(201).json({ message: 'Assignment added', id: results.insertId });
    });
  });
});

// Get assignments
app.get('/assignments', (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const sql = 'SELECT * FROM assignments WHERE user_id = ?';
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Scheduler for sending email reminders
cron.schedule('0 * * * *', () => { // Every hour
  const now = new Date();
  const eightHoursLater = new Date(now.getTime() + 8 * 60 * 60 * 1000);

  console.log('Cron job triggered:', now, eightHoursLater);

  const sql = 'SELECT * FROM assignments WHERE due_date BETWEEN ? AND ?';
  db.query(sql, [now, eightHoursLater], (err, assignments) => {
    if (err) {
      console.error('Error fetching assignments:', err);
      return;
    }

    console.log('Assignments due soon:', assignments);

    assignments.forEach(assignment => {
      const emailSql = 'SELECT email FROM users WHERE id = ?';
      db.query(emailSql, [assignment.user_id], (err, users) => {
        if (err) {
          console.error('Error fetching user email:', err);
          return;
        }

        if (users.length === 0) {
          console.error('No user found for id:', assignment.user_id);
          return;
        }

        const userEmail = users[0].email;
        const subject = 'Assignment Due Soon!';
        const text = `Your assignment "${assignment.title}" is due in less than 8 hours. Please complete it soon.`;

        console.log('Sending reminder email to:', userEmail);

        sendReminderEmail(userEmail, subject, text);
      });
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
