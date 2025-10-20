-- Create Database
CREATE DATABASE IF NOT EXISTS itailor_db;
USE itailor_db;

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Measurements Table
CREATE TABLE IF NOT EXISTS measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    measurement_type ENUM('shirt', 'pant', 'suit', 'kurta', 'other') NOT NULL,
    -- Shirt/Kurta Measurements
    chest DECIMAL(8,2),
    waist DECIMAL(8,2),
    shoulder DECIMAL(8,2),
    sleeve_length DECIMAL(8,2),
    shirt_length DECIMAL(8,2),
    neck DECIMAL(8,2),
    -- Pant Measurements
    pant_length DECIMAL(8,2),
    pant_waist DECIMAL(8,2),
    hip DECIMAL(8,2),
    thigh DECIMAL(8,2),
    knee DECIMAL(8,2),
    bottom DECIMAL(8,2),
    -- Additional Details
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    delivery_date DATE,
    status ENUM('pending', 'in_progress', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    advance_payment DECIMAL(10,2) DEFAULT 0.00,
    remaining_payment DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    measurement_id INT,
    item_type ENUM('shirt', 'pant', 'suit', 'kurta', 'other') NOT NULL,
    quantity INT DEFAULT 1,
    fabric_type VARCHAR(100),
    color VARCHAR(50),
    design_details TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (measurement_id) REFERENCES measurements(id) ON DELETE SET NULL
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('cash', 'card', 'upi', 'bank_transfer', 'other') DEFAULT 'cash',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Insert Sample Data
INSERT INTO customers (name, email, phone, address, city) VALUES
('John Doe', 'john@example.com', '1234567890', '123 Main St', 'New York'),
('Jane Smith', 'jane@example.com', '0987654321', '456 Oak Ave', 'Los Angeles');

INSERT INTO measurements (customer_id, measurement_type, chest, waist, shoulder, sleeve_length, shirt_length, neck) VALUES
(1, 'shirt', 40.00, 34.00, 17.00, 24.00, 30.00, 15.50);

INSERT INTO orders (customer_id, order_date, delivery_date, status, total_amount, advance_payment, remaining_payment) VALUES
(1, '2024-01-15', '2024-01-25', 'in_progress', 2500.00, 1000.00, 1500.00);

INSERT INTO order_items (order_id, measurement_id, item_type, quantity, fabric_type, color, price) VALUES
(1, 1, 'shirt', 2, 'Cotton', 'Blue', 1200.00);
