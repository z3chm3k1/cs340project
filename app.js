const express = require('express');
const path = require('path');
const mysql = require('mysql'); // Use mysql instead of mysql2
const app = express();
const PORT = 1000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
    DATABASE CONFIGURATION
*/

// Update this to match your actual database credentials
const dbConfig = {
    host: 'classmysql.engr.oregonstate.edu',
    user: '',
    password: '',
    database: ''
};

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
    SERVING STATIC FILES
*/

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname)));

// Serve the index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Wildcard route to serve any other HTML files
app.get('/*.html', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    res.sendFile(filePath);
});

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
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express started on http://flip3.engr.oregonstate.edu:${PORT}; press Ctrl-C to terminate.`);
});
