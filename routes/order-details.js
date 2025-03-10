const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all order details with related information
router.get('/', async (req, res) => {
    try {
        console.log('GET request to /api/orderdetails');
        const sql = `
            SELECT OD.orderDetailID, OD.orderID, OD.menuItemID, OD.quantity, OD.subTotal,
                   O.customerID, C.name as customerName, 
                   MI.name as menuItemName, MI.price as menuItemPrice
            FROM OrderDetails OD
            JOIN Orders O ON OD.orderID = O.orderID
            JOIN Customers C ON O.customerID = C.customerID
            JOIN MenuItems MI ON OD.menuItemID = MI.menuItemID
            ORDER BY OD.orderDetailID DESC
        `;
        const results = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error('Error fetching order details:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET specific order detail by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`GET request to /api/orderdetails/${id}`);
        const sql = `
            SELECT OD.orderDetailID, OD.orderID, OD.menuItemID, OD.quantity, OD.subTotal,
                   O.customerID, C.name as customerName, 
                   MI.name as menuItemName, MI.price as menuItemPrice
            FROM OrderDetails OD
            JOIN Orders O ON OD.orderID = O.orderID
            JOIN Customers C ON O.customerID = C.customerID
            JOIN MenuItems MI ON OD.menuItemID = MI.menuItemID
            WHERE OD.orderDetailID = ?
        `;
        const result = await db.query(sql, [id]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Order detail not found' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Error fetching order detail:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new order detail
router.post('/', async (req, res) => {
    try {
        console.log('POST request to /api/orderdetails with body:', req.body);
        const { orderID, menuItemID, quantity } = req.body;
        
        // Validate if order exists
        const orderCheck = await db.query('SELECT orderID FROM Orders WHERE orderID = ?', [orderID]);
        if (orderCheck.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // Validate if menu item exists and get its price
        const menuItemCheck = await db.query('SELECT menuItemID, price FROM MenuItems WHERE menuItemID = ?', [menuItemID]);
        if (menuItemCheck.length === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        
        // Calculate subtotal
        const price = menuItemCheck[0].price;
        const subTotal = price * quantity;
        
        const sql = 'INSERT INTO OrderDetails (orderID, menuItemID, quantity, subTotal) VALUES (?, ?, ?, ?)';
        const result = await db.query(sql, [orderID, menuItemID, quantity, subTotal]);
        
        console.log('Order detail added with ID:', result.insertId);
        res.status(201).json({ 
            message: 'Order detail added successfully', 
            orderDetailID: result.insertId 
        });
    } catch (error) {
        console.error('Error adding order detail:', error);
        res.status(500).json({ error: error.message });
    }
});

// UPDATE order detail
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`PUT request to /api/orderdetails/${id} with body:`, req.body);
        const { orderID, menuItemID, quantity } = req.body;
        
        // Validate if order exists
        const orderCheck = await db.query('SELECT orderID FROM Orders WHERE orderID = ?', [orderID]);
        if (orderCheck.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // Validate if menu item exists and get its price
        const menuItemCheck = await db.query('SELECT menuItemID, price FROM MenuItems WHERE menuItemID = ?', [menuItemID]);
        if (menuItemCheck.length === 0) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        
        // Calculate subtotal
        const price = menuItemCheck[0].price;
        const subTotal = price * quantity;
        
        const sql = 'UPDATE OrderDetails SET orderID=?, menuItemID=?, quantity=?, subTotal=? WHERE orderDetailID=?';
        await db.query(sql, [orderID, menuItemID, quantity, subTotal, id]);
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating order detail:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE order detail
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`DELETE request to /api/orderdetails/${id}`);
        await db.query('DELETE FROM OrderDetails WHERE orderDetailID = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting order detail:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;