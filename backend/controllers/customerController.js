const db = require('../config/database');

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create new customer
const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, address, city } = req.body;
        
        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Name and phone are required' });
        }

        const [result] = await db.query(
            'INSERT INTO customers (name, email, phone, address, city) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, address, city]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Customer created successfully',
            data: { id: result.insertId, name, email, phone, address, city }
        });
    } catch (error) {
        console.error('Error creating customer:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update customer
const updateCustomer = async (req, res) => {
    try {
        const { name, email, phone, address, city } = req.body;
        const [result] = await db.query(
            'UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, city = ? WHERE id = ?',
            [name, email, phone, address, city, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        res.json({ success: true, message: 'Customer updated successfully' });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search customers
const searchCustomers = async (req, res) => {
    try {
        const searchTerm = req.query.q || '';
        const [rows] = await db.query(
            'SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? ORDER BY created_at DESC',
            [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers
};
