SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Customers, Orders, MenuItems, OrderDetails, Deliveries, Tables;

-- Table to store customer information
CREATE TABLE Customers (
    customerID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) NULL,
    address VARCHAR(255) NULL
);

-- Table to store order information
CREATE TABLE Orders (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT NOT NULL,
    tableID INT NULL UNIQUE,
    orderDate DATETIME NOT NULL,
    orderType ENUM('Delivery', 'Pickup', 'Dine-in') NOT NULL,
    totalAmount DECIMAL(10,2) NOT NULL,
    paymentStatus ENUM('Paid', 'Pending') NOT NULL,
    FOREIGN KEY (customerID) REFERENCES Customers(customerID),
    FOREIGN KEY (tableID) REFERENCES Tables(tableID)
);

-- Table to store menu items
CREATE TABLE MenuItems (
    menuItemID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    availabilityStatus BOOLEAN NOT NULL
);

-- Table to store details of each order (items ordered)
CREATE TABLE OrderDetails (
    orderDetailID INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT NOT NULL,
    menuItemID INT NOT NULL,
    quantity INT NOT NULL,
    subTotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (menuItemID) REFERENCES MenuItems(menuItemID)
);

-- Table to store delivery information for delivery orders
CREATE TABLE Deliveries (
    deliveryID INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT NOT NULL,
    deliveryCompany ENUM('Ubereats', 'Doordash', 'Grubhub') NOT NULL,
    deliveryStatus ENUM('Pending', 'Out for Delivery', 'Delivered') NOT NULL,
    deliveryTime DATETIME NULL,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID)
);

-- Table to store information about restaurant tables
CREATE TABLE Tables (
    tableID INT AUTO_INCREMENT PRIMARY KEY,
    tableNumber INT NOT NULL UNIQUE,
    Capacity INT NOT NULL,
    availabilityStatus BOOLEAN NOT NULL
);



insert into Customers (name, phone, email, address) values 
('John Doe', '123-456-7890', 'john@example.com', '123 Main St'),
('Jane Doe', '234-567-8901', 'jane@example.com', '456 Oak St'),
('Bob Lee', '345-678-9012', 'bob@example.com', '789 Pine St');


INSERT INTO Orders (customerID, tableID, orderDate, orderType, totalAmount, paymentStatus) VALUES
(3, NULL, '2024-02-05 18:30:00', 'Delivery', 35.50, 'Paid'),
(1, 5, '2024-02-05 19:00:00', 'Dine-in', 50.75, 'Pending'),
(2, NULL, '2024-02-06 12:15:00', 'Pickup', 20.00, 'Paid');

INSERT INTO MenuItems (name, price, category, availabilityStatus) VALUES
('Cheese', 12.00, 'Pizza', TRUE),
('Pepperoni', 14.50, 'Pizza', TRUE),
('Coke', 2.50, 'Drink', TRUE);

INSERT INTO OrderDetails (orderID, menuItemID, quantity, subTotal)
VALUES
  (1, 1, 2, 24.00),  -- 2x Cheese Pizza
  (2, 3, 2, 5.00),   -- 2x Coke
  (3, 2, 3, 43.50);  -- 3x Pepperoni Pizza

INSERT INTO Deliveries (orderID, deliveryCompany, deliveryStatus, deliveryTime) VALUES
(101,  'Ubereats', 'Out for Delivery', '2024-02-05 18:50:00'),
(102,  'Grubhub', 'Pending', '2024-02-06 10:45:00'),
(103,  'Doordash', 'Delivered', '2024-02-06 12:45:00');


INSERT INTO Tables (tableNumber, Capacity, availabilityStatus) VALUES
(1, 5, TRUE),
(2, 10, FALSE),
(3, 7, TRUE);







SET FOREIGN_KEY_CHECKS=1;
COMMIT;
