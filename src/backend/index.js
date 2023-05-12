const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'stellardb',
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

app.get('/properties', async (req, res) => {
  let limit = parseInt(req.query.limit);
  let offset = parseInt(req.query.offset);
  
  if (isNaN(limit)) limit = 1000;
  if (isNaN(offset)) offset = 0;
  
  try {
    const query = `
      SELECT *
      FROM properties AS p
      JOIN properties_group_1 AS g1 ON p.id = g1.main_id
      JOIN properties_group_2 AS g2 ON p.id = g2.main_id
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(query, [limit, offset]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
