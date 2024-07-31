// cronjob.js
const cron = require('node-cron');
const { sendEmail } = require('./mailer');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});

// Schedule a cron job to run every hour
cron.schedule('0 * * * *', () => {
  const currentTime = new Date();
  const deadlineTime = new Date(currentTime.getTime() + 5 * 60 * 60 * 1000); // 5 hours from now
  const formattedDeadline = deadlineTime.toISOString().slice(0, 19).replace('T', ' ');

  const sql = 'SELECT a.title, a.due_date, u.email FROM assignments a JOIN users u ON a.user_id = u.id WHERE a.due_date <= ? AND a.completed = 0';
  
  db.query(sql, [formattedDeadline], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return;
    }

    results.forEach((assignment) => {
      const subject = `Reminder: Assignment Deadline Approaching`;
      const text = `Your assignment "${assignment.title}" is due soon on ${assignment.due_date}. Please complete it as soon as possible.`;
      sendEmail(assignment.email, subject, text)
        .then(() => console.log(`Reminder email sent to ${assignment.email}`))
        .catch((error) => console.error('Error sending email:', error));
    });
  });
});
