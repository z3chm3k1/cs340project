const express = require('express');
const path = require('path');
const app = express();
const PORT = 1000;

// Import database configuration
const db = require('./config/db');

// Import route modules
const customersRoutes = require('./routes/customers');
const ordersRoutes = require('./routes/orders');
const menuItemsRoutes = require('./routes/menu-items');
const deliveriesRoutes = require('./routes/deliveries');
const tablesRoutes = require('./routes/tables');
const orderDetailsRoutes = require('./routes/order-details');
const dropdownRoutes = require('./routes/dropdown');

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Test database connection on startup
db.testConnection()
    .then(() => console.log('Database connection successful'))
    .catch(err => console.error('Database connection failed:', err));

// Set up API routes
app.use('/api/customers', customersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/menuitems', menuItemsRoutes);
app.use('/api/deliveries', deliveriesRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/orderdetails', orderDetailsRoutes);
app.use('/api/dropdown', dropdownRoutes);

// Test route
app.get('/api/test', (req, res) => {
    console.log('Test route accessed');
    res.json({ message: 'API is working' });
});

// Debug route to list all registered routes
app.get('/api/debug/routes', (req, res) => {
    const routes = [];
    
    // Get all registered routes
    app._router.stack.forEach(middleware => {
        if (middleware.route) {
            // Routes registered directly on the app
            routes.push({
                path: middleware.route.path,
                methods: Object.keys(middleware.route.methods)
            });
        } else if (middleware.name === 'router') {
            // Routes added via router
            middleware.handle.stack.forEach(handler => {
                if (handler.route) {
                    routes.push({
                        path: handler.route.path,
                        methods: Object.keys(handler.route.methods)
                    });
                }
            });
        }
    });
    
    res.json(routes);
});

// Route handler for the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// Wildcard handler for HTML pages - redirect to the appropriate location in the public directory
app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    
    // Check if the requested page is one of our entities
    const entities = ['customers', 'orders', 'menu-items', 'deliveries', 'tables', 'order-details'];
    const entityPrefix = page.split('_')[0]; // e.g., "view" from "view_customers"
    const entityName = page.split('_')[1]; // e.g., "customers" from "view_customers"
    
    if (entities.includes(entityName)) {
        // It's an entity page, redirect to the new location
        res.sendFile(path.join(__dirname, 'public', 'html', entityName, `${page}.html`));
    } else {
        // Try to serve it from the root public/html directory
        res.sendFile(path.join(__dirname, 'public', 'html', `${page}.html`));
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express started on http://flip3.engr.oregonstate.edu:${PORT}; press Ctrl-C to terminate.`);
    console.log("Available API routes:");
    app._router.stack.forEach(r => {
        if (r.route && r.route.path) {
            console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
        }
    });
});
