const db = require('../config/database');

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, c.name as customer_name, c.phone as customer_phone 
            FROM orders o 
            JOIN customers c ON o.customer_id = c.id 
            ORDER BY o.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get order by ID with items
const getOrderById = async (req, res) => {
    try {
        const [orderRows] = await db.query(`
            SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email 
            FROM orders o 
            JOIN customers c ON o.customer_id = c.id 
            WHERE o.id = ?
        `, [req.params.id]);

        if (orderRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const [itemRows] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
        const [paymentRows] = await db.query('SELECT * FROM payments WHERE order_id = ?', [req.params.id]);

        const order = orderRows[0];
        order.items = itemRows;
        order.payments = paymentRows;

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get orders by customer
const getOrdersByCustomer = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
            [req.params.customerId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create new order
const createOrder = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { customer_id, order_date, delivery_date, status, total_amount, advance_payment, notes, items } = req.body;

        if (!customer_id || !order_date || !items || items.length === 0) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Customer ID, order date, and items are required' });
        }

        // Parse numeric values
        const parsedTotalAmount = parseFloat(total_amount) || 0;
        const parsedAdvancePayment = parseFloat(advance_payment) || 0;
        const remaining_payment = parsedTotalAmount - parsedAdvancePayment;

        const [orderResult] = await connection.query(
            `INSERT INTO orders (customer_id, order_date, delivery_date, status, total_amount, advance_payment, remaining_payment, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [customer_id, order_date, delivery_date || null, status || 'pending', parsedTotalAmount, parsedAdvancePayment, remaining_payment, notes || null]
        );

        const orderId = orderResult.insertId;

        for (const item of items) {
            const measurementId = item.measurement_id === '' || item.measurement_id === 'null' ? null : item.measurement_id;
            const quantity = parseInt(item.quantity) || 1;
            const price = parseFloat(item.price) || 0;
            
            await connection.query(
                `INSERT INTO order_items (order_id, measurement_id, item_type, quantity, fabric_type, color, design_details, price) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [orderId, measurementId, item.item_type, quantity, item.fabric_type || null, item.color || null, item.design_details || null, price]
            );
        }

        if (parsedAdvancePayment > 0) {
            await connection.query(
                'INSERT INTO payments (order_id, amount, payment_date, payment_method, notes) VALUES (?, ?, ?, ?, ?)',
                [orderId, parsedAdvancePayment, order_date, 'cash', 'Advance payment']
            );
        }

        await connection.commit();

        res.status(201).json({ 
            success: true, 
            message: 'Order created successfully',
            data: { id: orderId }
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};

// Update order
const updateOrder = async (req, res) => {
    try {
        const { order_date, delivery_date, status, total_amount, advance_payment, notes } = req.body;
        
        // Parse numeric values
        const parsedTotalAmount = parseFloat(total_amount) || 0;
        const parsedAdvancePayment = parseFloat(advance_payment) || 0;
        const remaining_payment = parsedTotalAmount - parsedAdvancePayment;

        const [result] = await db.query(
            `UPDATE orders SET order_date = ?, delivery_date = ?, status = ?, total_amount = ?, 
            advance_payment = ?, remaining_payment = ?, notes = ? WHERE id = ?`,
            [order_date, delivery_date || null, status, parsedTotalAmount, parsedAdvancePayment, remaining_payment, notes || null, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const [totalCustomers] = await db.query('SELECT COUNT(*) as count FROM customers');
        const [totalOrders] = await db.query('SELECT COUNT(*) as count FROM orders');
        const [pendingOrders] = await db.query('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
        const [inProgressOrders] = await db.query('SELECT COUNT(*) as count FROM orders WHERE status = "in_progress"');
        const [readyOrders] = await db.query('SELECT COUNT(*) as count FROM orders WHERE status = "ready"');
        const [totalRevenue] = await db.query('SELECT SUM(total_amount) as total FROM orders WHERE status != "cancelled"');
        const [pendingPayments] = await db.query('SELECT SUM(remaining_payment) as total FROM orders WHERE status != "cancelled" AND status != "delivered"');

        res.json({
            success: true,
            data: {
                totalCustomers: totalCustomers[0].count,
                totalOrders: totalOrders[0].count,
                pendingOrders: pendingOrders[0].count,
                inProgressOrders: inProgressOrders[0].count,
                readyOrders: readyOrders[0].count,
                totalRevenue: totalRevenue[0].total || 0,
                pendingPayments: pendingPayments[0].total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    getOrdersByCustomer,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    getDashboardStats
};
