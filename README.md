Crazy Pizza Order Management System -

Folder Structure 
cs340_project/
│
├── app.js                     # Main entry point
├── package.json               # Dependencies
├── config/
│   └── db.js                  # Database connection configuration
│
├── routes/                    # Route modules
│   ├── customers.js
│   ├── orders.js
│   ├── menu-items.js
│   ├── deliveries.js
│   ├── tables.js
│   ├── order-details.js
│   └── dropdown.js            # For dropdown helper routes
│
├── public/                    # Static files
│   ├── css/
│   │   └── CrazyPizzaStyle.css
│   ├── js/
│   │   └── common.js          # Shared JavaScript functions
│   │
│   └── html/                  # HTML pages
│       ├── index.html
│       ├── customers/
│       │   ├── view_customers.html
│       │   ├── add_customer.html
│       │   └── update_customer.html
│       │
│       │── orders/
│       │   ├── view_orders.html
│       │   ├── add_order.html
│       │   └── update_order.html
│       │
│       │── menu-items/
│       │   ├── view_menu_items.html
│       │   ├── add_menu_item.html
│       │   └── update_menu_item.html
│       │
│       │── deliveries/
│       │   ├── view_deliveries.html
│       │   ├── add_delivery.html
│       │   └── update_delivery.html
│       │
│       │── tables/
│       │   ├── view_tables.html
│       │   ├── add_table.html
│       │   └── update_table.html
│       │
│       └── order-details/
│           ├── view_order_details.html
│           ├── add_order_detail.html
│           └── update_order_detail.html