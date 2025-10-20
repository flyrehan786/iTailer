const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function seedUsers() {
  try {
    console.log('Creating users table...');
    
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Users table created successfully');

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert default admin user
    await db.query(`
      INSERT INTO users (username, email, password, full_name, phone, role) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        email = VALUES(email),
        full_name = VALUES(full_name),
        phone = VALUES(phone),
        role = VALUES(role)
    `, ['admin', 'admin@tsystem.com', hashedPassword, 'System Administrator', '1234567890', 'admin']);

    console.log('Default admin user created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@tsystem.com');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
