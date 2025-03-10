## 📁 Project Structure

```text
cs340project/
│
├── app.js                     # Main entry point
├── DDL.sql                    # Database definition file
├── DML.sql                    # Database manipulation queries
├── package.json               # Dependencies
├── package-lock.json          # Dependencies lock file
│
├── config/
│   └── db.js                  # Database connection configuration
│
├── node_modules/              # Node.js dependencies
│
├── public/
│   ├── css/
│   │   └── CrazyPizzaStyle.css
│   │
│   ├── html/
│   │   ├── index.html
│   │   │
│   │   ├── customers/
│   │   │   ├── add_customer.html
│   │   │   ├── update_customer.html
│   │   │   └── view_customers.html
│   │   │
│   │   ├── deliveries/
│   │   │   ├── add_delivery.html
│   │   │   ├── update_delivery.html
│   │   │   └── view_deliveries.html
│   │   │
│   │   ├── menu-items/
│   │   │   ├── add_menu_item.html
│   │   │   ├── update_menu_item.html
│   │   │   └── view_menu_items.html
│   │   │
│   │   ├── order-details/
│   │   │   ├── add_order_detail.html
│   │   │   ├── update_order_detail.html
│   │   │   └── view_order_details.html
│   │   │
│   │   ├── orders/
│   │   │   ├── add_order.html
│   │   │   ├── update_order.html
│   │   │   └── view_orders.html
│   │   │
│   │   └── tables/
│   │       ├── add_table.html
│   │       ├── update_table.html
│   │       └── view_tables.html
│   │
│   └── js/
│       ├── common.js
│       
│       
│       
│       
│       
│       
│
└── routes/
    ├── customers.js
    ├── deliveries.js
    ├── dropdown.js
    ├── menu-items.js
    ├── order-details.js
    ├── orders.js
    └── tables.js
