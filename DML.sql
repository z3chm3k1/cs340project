-- ==================================================
-- DML.SQL - Data Manipulation Queries for Crazy Pizza DB
-- ==================================================



SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================
-- 1. INSERT Statements (Adding Sample Data)
-- ==============================================

-- Insert Customers
INSERT INTO Customers (name, phone, email, address) VALUES
('John Doe', '123-456-7890', 'john@example.com', '123 Main St'),
('Jane Doe', '234-567-8901', 'jane@example.com', '456 Oak St'),
('Bob Lee', '345-678-9012', 'bob@example.com', '789 Pine St');

-- Insert Tables
INSERT INTO Tables (tableNumber, Capacity, availabilityStatus) VALUES
(5, 4, TRUE),
(10, 6, FALSE),
(7, 4, TRUE);

-- Insert Menu Items
INSERT INTO MenuItems (name, price, category, availabilityStatus) VALUES
('Cheese', 12.00, 'Pizza', TRUE),
('Pepperoni', 14.50, 'Pizza', TRUE),
('Coke', 2.50, 'Drink', TRUE);

-- Insert Orders
INSERT INTO Orders (customerID, tableID, orderDate, orderType, totalAmount, paymentStatus) VALUES
((SELECT customerID FROM Customers WHERE name = 'Bob Lee'), NULL, '2024-02-05 18:30:00', 'Delivery', 35.50, 'Paid'),
((SELECT customerID FROM Customers WHERE name = 'John Doe'), 
 (SELECT tableID FROM Tables WHERE tableNumber = 5), '2024-02-05 19:00:00', 'Dine-in', 50.75, 'Pending'),
((SELECT customerID FROM Customers WHERE name = 'Jane Doe'), NULL, '2024-02-06 12:15:00', 'Pickup', 20.00, 'Paid');

-- Insert Order Details (Many-to-Many Relationship)
INSERT INTO OrderDetails (orderID, menuItemID, quantity, subTotal) VALUES
((SELECT orderID FROM Orders WHERE customerID = (SELECT customerID FROM Customers WHERE name = 'Bob Lee')),
 (SELECT menuItemID FROM MenuItems WHERE name = 'Cheese'),
 2, 24.00),

((SELECT orderID FROM Orders WHERE customerID = (SELECT customerID FROM Customers WHERE name = 'John Doe')),
 (SELECT menuItemID FROM MenuItems WHERE name = 'Coke'),
 2, 5.00),

((SELECT orderID FROM Orders WHERE customerID = (SELECT customerID FROM Customers WHERE name = 'Jane Doe')),
 (SELECT menuItemID FROM MenuItems WHERE name = 'Pepperoni'),
 3, 43.50);

-- Insert Deliveries
INSERT INTO Deliveries (orderID, deliveryCompany, deliveryStatus, deliveryTime) VALUES
((SELECT orderID FROM Orders WHERE customerID = (SELECT customerID FROM Customers WHERE name = 'Bob Lee')),
 'Ubereats', 'Out for Delivery', '2024-02-05 18:50:00'),

((SELECT orderID FROM Orders WHERE customerID = (SELECT customerID FROM Customers WHERE name = 'John Doe')),
 'Grubhub', 'Pending', '2024-02-06 10:45:00'),

((SELECT orderID FROM Orders WHERE customerID = (SELECT customerID FROM Customers WHERE name = 'Jane Doe')),
 'Doordash', 'Delivered', '2024-02-06 12:45:00');

-- ==============================================
-- 2. SELECT Queries (Fetching Data)
-- ==============================================

-- Get All Customers
SELECT * FROM Customers;

-- Get All Orders with Customer Names
SELECT O.orderID, C.name AS customerName, O.tableID, O.orderDate, O.orderType, O.totalAmount, O.paymentStatus
FROM Orders O
JOIN Customers C ON O.customerID = C.customerID;

-- Get Available Menu Items
SELECT menuItemID, name AS itemName, price, category FROM MenuItems WHERE availabilityStatus = TRUE;

-- Get Available Tables
SELECT tableID, tableNumber, Capacity FROM Tables WHERE availabilityStatus = TRUE;

-- Get Orders and Their Items
SELECT OD.orderDetailID, O.orderID, C.name AS customerName, M.name AS menuItem, OD.quantity, OD.subTotal
FROM OrderDetails OD
JOIN Orders O ON OD.orderID = O.orderID
JOIN Customers C ON O.customerID = C.customerID
JOIN MenuItems M ON OD.menuItemID = M.menuItemID;

-- Get Deliveries
SELECT D.deliveryID, C.name AS customerName, D.deliveryCompany, D.deliveryStatus, D.deliveryTime
FROM Deliveries D
JOIN Orders O ON D.orderID = O.orderID
JOIN Customers C ON O.customerID = C.customerID;

-- ==============================================
-- 3. UPDATE Statements (Modifying Data)
-- ==============================================

-- Update Customer Information
UPDATE Customers
SET email = 'john.new@email.com', phone = '321-654-0987'
WHERE name = 'John Doe';

-- Update Order Payment Status
UPDATE Orders
SET paymentStatus = 'Paid'
WHERE orderID = (SELECT orderID FROM Orders WHERE customerID = (SELECT customerID FROM Customers WHERE name = 'Jane Doe'));

-- Update Menu Item Price
UPDATE MenuItems
SET price = 13.50
WHERE name = 'Cheese';

-- Update Table Availability
UPDATE Tables
SET availabilityStatus = FALSE
WHERE tableID = (SELECT tableID FROM Tables WHERE tableNumber = 5);

-- Update Delivery Status
UPDATE Deliveries
SET deliveryStatus = 'Delivered'
WHERE deliveryID = (SELECT deliveryID FROM Deliveries WHERE deliveryCompany = 'Ubereats');

-- ==============================================
-- 4. DELETE Statements (Removing Data)
-- ==============================================

-- Delete an Order (Cascade to Order Details)
DELETE FROM Orders
WHERE orderID = (SELECT orderID FROM Orders WHERE customerID = (SELECT customerID FROM Customers WHERE name = 'Jane Doe'));

-- Delete a Customer (Only If No Orders Exist)
DELETE FROM Customers
WHERE customerID = (SELECT customerID FROM Customers WHERE name = 'John Doe')
AND NOT EXISTS (SELECT 1 FROM Orders WHERE customerID = Customers.customerID);

-- Delete a Menu Item
DELETE FROM MenuItems
WHERE name = 'Coke';

-- Delete a Table Entry
DELETE FROM Tables
WHERE tableNumber = 10;

-- ==============================================
-- 5. Populating Dropdowns Dynamically
-- ==============================================

-- Populate Customers Dropdown
SELECT customerID, name FROM Customers ORDER BY name;

-- Populate Orders Dropdown
SELECT orderID, customerID FROM Orders ORDER BY orderID;

-- Populate Menu Items Dropdown
SELECT menuItemID, name FROM MenuItems ORDER BY name;

-- Populate Table Numbers Dropdown
SELECT tableID, tableNumber FROM Tables WHERE availabilityStatus = TRUE;

-- Populate Order Types Dropdown (Static Values)
SELECT 'Delivery' AS orderType UNION SELECT 'Pickup' UNION SELECT 'Dine-in';

-- Populate Payment Status Dropdown (Static Values)
SELECT 'Paid' AS paymentStatus UNION SELECT 'Pending';

-- Populate Delivery Companies Dropdown (Static Values)
SELECT 'Ubereats' AS deliveryCompany UNION SELECT 'Doordash' UNION SELECT 'Grubhub';

-- Populate Delivery Status Dropdown (Static Values)
SELECT 'Pending' AS deliveryStatus UNION SELECT 'Out for Delivery' UNION SELECT 'Delivered';

-- ==============================================
-- END OF FILE
-- ==============================================
