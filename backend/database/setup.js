const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    let connection;
    
    try {
        console.log('=================================');
        console.log('Database Setup Started...');
        console.log('=================================\n');

        // Connect to MySQL without specifying database
        console.log('Step 1: Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            port: process.env.DB_PORT || 3306
        });
        console.log('✓ Connected to MySQL successfully!\n');

        // Create database
        console.log('Step 2: Creating database...');
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'itailor_db'}`);
        console.log(`✓ Database '${process.env.DB_NAME || 'itailor_db'}' created successfully!\n`);

        // Use the database
        await connection.query(`USE ${process.env.DB_NAME || 'itailor_db'}`);

        // Create tables
        console.log('Step 3: Creating tables...');
        
        // Customers Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE,
                phone VARCHAR(20) NOT NULL,
                address TEXT,
                city VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('  ✓ Customers table created');

        // Measurements Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS measurements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id INT NOT NULL,
                measurement_type ENUM('shirt', 'pant', 'suit', 'kurta', 'other') NOT NULL,
                chest DECIMAL(8,2),
                waist DECIMAL(8,2),
                shoulder DECIMAL(8,2),
                sleeve_length DECIMAL(8,2),
                shirt_length DECIMAL(8,2),
                neck DECIMAL(8,2),
                pant_length DECIMAL(8,2),
                pant_waist DECIMAL(8,2),
                hip DECIMAL(8,2),
                thigh DECIMAL(8,2),
                knee DECIMAL(8,2),
                bottom DECIMAL(8,2),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
            )
        `);
        console.log('  ✓ Measurements table created');

        // Orders Table
        await connection.query(`
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
            )
        `);
        console.log('  ✓ Orders table created');

        // Order Items Table
        await connection.query(`
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
            )
        `);
        console.log('  ✓ Order Items table created');

        // Payments Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                payment_date DATE NOT NULL,
                payment_method ENUM('cash', 'card', 'upi', 'bank_transfer', 'other') DEFAULT 'cash',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
        `);
        console.log('  ✓ Payments table created\n');

        console.log('=================================');
        console.log('✓ Database setup completed!');
        console.log('=================================\n');

        await connection.end();
        
        console.log('Now running seeder...\n');
        
        // Run seeder
        require('./seeder');

    } catch (error) {
        console.error('❌ Error during setup:', error.message);
        if (connection) {
            await connection.end();
        }
        process.exit(1);
    }
}

setupDatabase();
