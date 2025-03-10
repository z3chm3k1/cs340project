const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all tables
router.get('/', async (req, res) => {
    try {
        console.log('GET request to /api/tables');
        const results = await db.query('SELECT * FROM Tables');
        res.json(results);
    } catch (err) {
        console.error('Error fetching tables:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET specific table by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`GET request to /api/tables/${id}`);
        const result = await db.query('SELECT * FROM Tables WHERE tableID = ?', [id]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Error fetching table:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new table
router.post('/', async (req, res) => {
    try {
        console.log('POST request to /api/tables with body:', req.body);
        const { tableNumber, Capacity, availabilityStatus } = req.body;
        
        // Convert availability to boolean
        const isAvailable = availabilityStatus === 'true' || availabilityStatus === true;
        
        const sql = 'INSERT INTO Tables (tableNumber, Capacity, availabilityStatus) VALUES (?, ?, ?)';
        const result = await db.query(sql, [tableNumber, Capacity, isAvailable]);
        
        console.log('Table added with ID:', result.insertId);
        res.status(201).json({ 
            message: 'Table added successfully', 
            tableID: result.insertId 
        });
    } catch (error) {
        console.error('Error adding table:', error);
        res.status(500).json({ error: error.message });
    }
});

// UPDATE table
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`PUT request to /api/tables/${id} with body:`, req.body);
        const { tableNumber, Capacity, availabilityStatus } = req.body;
        
        // Convert availability to boolean
        const isAvailable = availabilityStatus === 'true' || availabilityStatus === true;
        
        const sql = 'UPDATE Tables SET tableNumber=?, Capacity=?, availabilityStatus=? WHERE tableID=?';
        await db.query(sql, [tableNumber, Capacity, isAvailable, id]);
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating table:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE table
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`DELETE request to /api/tables/${id}`);
        await db.query('DELETE FROM Tables WHERE tableID = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting table:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;