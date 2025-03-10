const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all orders with customer names
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT O.orderID, O.customerID, C.name as customerName, 
                   O.tableID, O.orderDate, O.orderType, 
                   O.totalAmount, O.paymentStatus
            FROM Orders O
            JOIN Customers C ON O.customerID = C.customerID
        `;
        const results = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET specific order by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `
            SELECT O.orderID, O.customerID, C.name as customerName, 
                   O.tableID, O.orderDate, O.orderType, 
                   O.totalAmount, O.paymentStatus
            FROM Orders O
            JOIN Customers C ON O.customerID = C.customerID
            WHERE O.orderID = ?
        `;
        const result = await db.query(sql, [id]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new order
router.post('/', async (req, res) => {
    const { customerID, tableID, orderType, totalAmount, paymentStatus } = req.body;
    try {
        const orderDate = new Date(); // Use current date/time
        
        const sql = `
            INSERT INTO Orders 
            (customerID, tableID, orderDate, orderType, totalAmount, paymentStatus) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const result = await db.query(sql, [
            customerID, 
            tableID || null, // Handle null table ID for non-dine-in orders
            orderDate, 
            orderType, 
            totalAmount, 
            paymentStatus
        ]);
        
        res.status(201).json({ 
            message: 'Order created successfully', 
            orderID: result.insertId 
        });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: err.message });
    }
});

// UPDATE order
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { customerID, tableID, orderType, totalAmount, paymentStatus } = req.body;
    
    try {
        const sql = `
            UPDATE Orders 
            SET customerID = ?, tableID = ?, orderType = ?, 
                totalAmount = ?, paymentStatus = ?
            WHERE orderID = ?
        `;
        
        await db.query(sql, [
            customerID, 
            tableID || null, 
            orderType, 
            totalAmount, 
            paymentStatus, 
            id
        ]);
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE order
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Orders WHERE orderID = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;