SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Customers, Orders, MenuItems, OrderDetails, Deliveries, Tables;

CREATE TABLE Customers (
    customerID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) NULL,
    address VARCHAR(255) NULL
);

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

CREATE TABLE MenuItems (
    menuItemID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    availabilityStatus BOOLEAN NOT NULL
);

CREATE TABLE OrderDetails (
    orderDetailID INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT NOT NULL,
    menuItemID INT NOT NULL,
    quantity INT NOT NULL,
    subTotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (menuItemID) REFERENCES MenuItems(menuItemID)
);

CREATE TABLE Deliveries (
    deliveryID INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT NOT NULL,
    deliveryCompany ENUM('Ubereats', 'Doordash', 'Grubhub') NOT NULL,
    deliveryStatus ENUM('Pending', 'Out for Delivery', 'Delivered') NOT NULL,
    deliveryTime DATETIME NULL,
    FOREIGN KEY (orderID) REFERENCES Orders(orderID)
);

CREATE TABLE Tables (
    tableID INT AUTO_INCREMENT PRIMARY KEY,
    tableNumber INT NOT NULL UNIQUE,
    Capacity INT NOT NULL,
    availabilityStatus BOOLEAN NOT NULL
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
