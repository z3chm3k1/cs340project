// App.js
const express = require('express');
const app = express();
const PORT = 9124;
const mysql = require('mysql'); // Use mysql instead of mysql2

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*
8888888888888888888888888888888888888888888888888888888
*/ 

//NEED to change to School DATABASE
const dbConfig = {
    host: 'localhost',
    user: 'your_mysql_user',
    password: 'your_mysql_password',
    database: 'your_database_name'
  };
  
/*
8888888888888888888888888888888888888888888888888888888
*/ 
  

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Helper function to execute queries with Promises
function query(sql, params) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

/*
    CUSTOMERS CRUD ROUTES
*/

// GET all customers
app.get('/api/customers', async (req, res) => {
  try {
    const results = await query('SELECT * FROM Customers');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new customer
app.post('/api/customers', async (req, res) => {
  const { name, phone, email, address } = req.body;
  try {
    const result = await query(
      'INSERT INTO Customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
      [name, phone, email, address]
    );
    res.json({ customerID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE customer
app.put('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;
  try {
    await query(
      'UPDATE Customers SET name=?, phone=?, email=?, address=? WHERE customerID=?',
      [name, phone, email, address, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE customer
app.delete('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM Customers WHERE customerID=?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
    LISTENER
*/
app.listen(PORT, () => {
  console.log(`Express started on http://localhost:${PORT}; press Ctrl-C to terminate.`);
});