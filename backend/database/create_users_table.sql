-- Create users table
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
);

-- Insert a default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (username, email, password, full_name, role) 
VALUES (
    'admin',
    'admin@tsystem.com',
    '$2a$10$rXKZ8vZqK5YqYqYqYqYqYuO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K',
    'System Administrator',
    'admin'
) ON DUPLICATE KEY UPDATE username=username;

-- Note: The password above is a placeholder. To generate a proper bcrypt hash, run:
-- node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"
-- and replace the hash above with the output
