const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all customers
router.get('/', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM Customers');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET specific customer by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM Customers WHERE customerID = ?', [id]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new customer
router.post('/', async (req, res) => {
    const { name, phone, email, address } = req.body;
    console.log('Received request to add customer:', req.body);
    try {
        const sql = 'INSERT INTO Customers (name, phone, email, address) VALUES (?, ?, ?, ?)';
        const result = await db.query(sql, [name, phone, email, address]);
        console.log('Customer added with ID:', result.insertId);
        res.status(201).json({ message: 'Customer added successfully', customerID: result.insertId });
    } catch (error) {
        console.error('Error adding customer:', error);
        res.status(500).json({ error: 'Failed to add customer' });
    }
});

// UPDATE customer
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;
    try {
        await db.query(
            'UPDATE Customers SET name=?, phone=?, email=?, address=? WHERE customerID=?',
            [name, phone, email, address, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Customers WHERE customerID=?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;