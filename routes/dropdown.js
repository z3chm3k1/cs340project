const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all customers for dropdowns
router.get('/customers', async (req, res) => {
    try {
        const results = await db.query('SELECT customerID, name FROM Customers ORDER BY name');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all tables for dropdowns
router.get('/tables', async (req, res) => {
    try {
        const results = await db.query('SELECT tableID, tableNumber FROM Tables WHERE availabilityStatus = TRUE');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all orders for dropdowns
router.get('/orders', async (req, res) => {
    try {
        console.log('GET request to /api/dropdown/orders');
        const sql = `
            SELECT O.orderID, C.name as customerName, O.orderDate 
            FROM Orders O
            JOIN Customers C ON O.customerID = C.customerID
            ORDER BY O.orderID DESC
        `;
        const results = await db.query(sql);
        console.log('Orders for dropdown:', results.length);
        res.json(results);
    } catch (err) {
        console.error('Error fetching orders for dropdown:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get unique menu categories for dropdowns
router.get('/categories', async (req, res) => {
    try {
        const results = await db.query('SELECT DISTINCT category FROM MenuItems ORDER BY category');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get menu items with order information for dropdown
router.get('/menuitems', async (req, res) => {
    try {
        console.log('GET request to /api/dropdown/menuitems');
        // Get orders
        const ordersQuery = `
            SELECT O.orderID, C.name as customerName, O.orderDate 
            FROM Orders O
            JOIN Customers C ON O.customerID = C.customerID
            ORDER BY O.orderID DESC
        `;
        const orders = await db.query(ordersQuery);
        
        // Get menu items
        const menuItemsQuery = `
            SELECT menuItemID, name, price, category 
            FROM MenuItems 
            WHERE availabilityStatus = TRUE
            ORDER BY name
        `;
        const menuItems = await db.query(menuItemsQuery);
        
        res.json({
            orders: orders,
            menuItems: menuItems
        });
    } catch (err) {
        console.error('Error fetching dropdown data:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;