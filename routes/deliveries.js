const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all deliveries with order and customer info
router.get('/', async (req, res) => {
    try {
        console.log('GET request to /api/deliveries');
        const sql = `
            SELECT D.deliveryID, D.orderID, D.deliveryCompany, D.deliveryStatus, D.deliveryTime,
                   O.customerID, C.name as customerName
            FROM Deliveries D
            JOIN Orders O ON D.orderID = O.orderID
            JOIN Customers C ON O.customerID = C.customerID
        `;
        const results = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error('Error fetching deliveries:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET specific delivery by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`GET request to /api/deliveries/${id}`);
        const sql = `
            SELECT D.deliveryID, D.orderID, D.deliveryCompany, D.deliveryStatus, D.deliveryTime,
                   O.customerID, C.name as customerName
            FROM Deliveries D
            JOIN Orders O ON D.orderID = O.orderID
            JOIN Customers C ON O.customerID = C.customerID
            WHERE D.deliveryID = ?
        `;
        const result = await db.query(sql, [id]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Delivery not found' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Error fetching delivery:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new delivery
router.post('/', async (req, res) => {
    try {
        console.log('POST request to /api/deliveries with body:', req.body);
        const { orderID, deliveryCompany, deliveryStatus, deliveryTime } = req.body;
        
        // Validate if order exists
        const orderCheck = await db.query('SELECT orderID FROM Orders WHERE orderID = ?', [orderID]);
        if (orderCheck.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        const sql = 'INSERT INTO Deliveries (orderID, deliveryCompany, deliveryStatus, deliveryTime) VALUES (?, ?, ?, ?)';
        const result = await db.query(sql, [orderID, deliveryCompany, deliveryStatus, deliveryTime]);
        
        console.log('Delivery added with ID:', result.insertId);
        res.status(201).json({ 
            message: 'Delivery added successfully', 
            deliveryID: result.insertId 
        });
    } catch (error) {
        console.error('Error adding delivery:', error);
        res.status(500).json({ error: error.message });
    }
});

// UPDATE delivery
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`PUT request to /api/deliveries/${id} with body:`, req.body);
        const { orderID, deliveryCompany, deliveryStatus, deliveryTime } = req.body;
        
        // Validate if order exists
        const orderCheck = await db.query('SELECT orderID FROM Orders WHERE orderID = ?', [orderID]);
        if (orderCheck.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        const sql = 'UPDATE Deliveries SET orderID=?, deliveryCompany=?, deliveryStatus=?, deliveryTime=? WHERE deliveryID=?';
        await db.query(sql, [orderID, deliveryCompany, deliveryStatus, deliveryTime, id]);
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating delivery:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE delivery
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`DELETE request to /api/deliveries/${id}`);
        await db.query('DELETE FROM Deliveries WHERE deliveryID = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting delivery:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;