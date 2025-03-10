const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all menu items
router.get('/', async (req, res) => {
    try {
        console.log('GET request to /api/menuitems');
        const results = await db.query('SELECT * FROM MenuItems');
        res.json(results);
    } catch (err) {
        console.error('Error fetching menu items:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET specific menu item by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`GET request to /api/menuitems/${id}`);
        const result = await db.query('SELECT * FROM MenuItems WHERE menuItemID = ?', [id]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Error fetching menu item:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new menu item
router.post('/', async (req, res) => {
    try {
        console.log('POST request to /api/menuitems with body:', req.body);
        const { name, price, category, availabilityStatus } = req.body;
        
        // Convert availability to boolean
        const isAvailable = availabilityStatus === 'true' || availabilityStatus === true;
        
        const sql = 'INSERT INTO MenuItems (name, price, category, availabilityStatus) VALUES (?, ?, ?, ?)';
        const result = await db.query(sql, [name, price, category, isAvailable]);
        
        console.log('Menu item added with ID:', result.insertId);
        res.status(201).json({ 
            message: 'Menu item added successfully', 
            menuItemID: result.insertId 
        });
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ error: error.message });
    }
});

// UPDATE menu item
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`PUT request to /api/menuitems/${id} with body:`, req.body);
        const { name, price, category, availabilityStatus } = req.body;
        
        // Convert availability to boolean
        const isAvailable = availabilityStatus === 'true' || availabilityStatus === true;
        
        const sql = 'UPDATE MenuItems SET name=?, price=?, category=?, availabilityStatus=? WHERE menuItemID=?';
        await db.query(sql, [name, price, category, isAvailable, id]);
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating menu item:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE menu item
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`DELETE request to /api/menuitems/${id}`);
        await db.query('DELETE FROM MenuItems WHERE menuItemID = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting menu item:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;