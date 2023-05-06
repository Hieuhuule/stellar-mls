const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    port: '3306', 
    password: 'password',
    database: 'stellardb',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database.');
});

app.get('/properties', (req, res) => {
    const query = 'SELECT * FROM properties';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Error executing query' });
        return;
      }
      res.json(results);
    });
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
