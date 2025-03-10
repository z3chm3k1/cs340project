## 📁 Project Structure

```text
cs340_project/
├── app.js                  # Main entry point
├── package.json            # Dependencies
├── config/
│   └── db.js               # Database connection configuration
├── routes/                 # Route modules
│   ├── customers.js
│   ├── orders.js
│   ├── menu-items.js
│   ├── deliveries.js
│   ├── tables.js
│   ├── order-details.js
│   └── dropdown.js         # For dropdown helper routes
├── public/                 # Static files
│   ├── css/
│   │   └── CrazyPizzaStyle.css
│   └── js/
│       └── common.js       # Shared JavaScript functions
├── html/                   # HTML pages
│   ├── index.html
│   ├── customers/
│   │   ├── view_customers.html
│   │   ├── add_customer.html
│   │   └── update_customer.html
│   ├── orders/
│   │   ├── view_orders.html
│   │   ├── add_order.html
│   │   └── update_order.html
