-- Insert new customer
INSERT INTO Customers (name, phone, email, address) 
VALUES (:name, :phone, :email, :address);

-- View all customers
SELECT * FROM Customers;

-- Insert new order
INSERT INTO Orders (customerID, tableID, orderDate, orderType, totalAmount, paymentStatus) 
VALUES (:customerID, :tableID, :orderDate, :orderType, :totalAmount, :paymentStatus);

-- View all orders
SELECT * FROM Orders;

-- Insert new menu item
INSERT INTO MenuItems (name, price, category, availabilityStatus) 
VALUES (:name, :price, :category, :availabilityStatus);

-- View all menu items
SELECT * FROM MenuItems;

-- Insert new delivery entry
INSERT INTO Deliveries (orderID, deliveryCompany, deliveryStatus, deliveryTime) 
VALUES (:orderID, :deliveryCompany, :deliveryStatus, :deliveryTime);

-- Update order status
UPDATE Orders 
SET paymentStatus = :newStatus 
WHERE orderID = :orderID;

-- Delete an order
DELETE FROM Orders 
WHERE orderID = :orderID;
