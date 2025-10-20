const db = require('../config/database');

// Get all payments for an order
const getPaymentsByOrder = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM payments WHERE order_id = ? ORDER BY payment_date DESC',
            [req.params.orderId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create new payment
const createPayment = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { order_id, amount, payment_date, payment_method, notes } = req.body;

        if (!order_id || !amount || !payment_date) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Order ID, amount, and payment date are required' });
        }

        // Parse numeric values
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Invalid payment amount' });
        }

        const [result] = await connection.query(
            'INSERT INTO payments (order_id, amount, payment_date, payment_method, notes) VALUES (?, ?, ?, ?, ?)',
            [order_id, parsedAmount, payment_date, payment_method || 'cash', notes || null]
        );

        const [orderRows] = await connection.query('SELECT advance_payment, total_amount FROM orders WHERE id = ?', [order_id]);
        
        if (orderRows.length > 0) {
            const newAdvancePayment = parseFloat(orderRows[0].advance_payment) + parsedAmount;
            const remaining = parseFloat(orderRows[0].total_amount) - newAdvancePayment;

            await connection.query(
                'UPDATE orders SET advance_payment = ?, remaining_payment = ? WHERE id = ?',
                [newAdvancePayment, remaining, order_id]
            );
        }

        await connection.commit();

        res.status(201).json({ 
            success: true, 
            message: 'Payment recorded successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating payment:', error);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};

// Delete payment
const deletePayment = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [paymentRows] = await connection.query('SELECT order_id, amount FROM payments WHERE id = ?', [req.params.id]);
        
        if (paymentRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        const { order_id, amount } = paymentRows[0];

        await connection.query('DELETE FROM payments WHERE id = ?', [req.params.id]);

        const [orderRows] = await connection.query('SELECT advance_payment, total_amount FROM orders WHERE id = ?', [order_id]);
        
        if (orderRows.length > 0) {
            const newAdvancePayment = parseFloat(orderRows[0].advance_payment) - parseFloat(amount);
            const remaining = parseFloat(orderRows[0].total_amount) - newAdvancePayment;

            await connection.query(
                'UPDATE orders SET advance_payment = ?, remaining_payment = ? WHERE id = ?',
                [newAdvancePayment, remaining, order_id]
            );
        }

        await connection.commit();

        res.json({ success: true, message: 'Payment deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error deleting payment:', error);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};

module.exports = {
    getPaymentsByOrder,
    createPayment,
    deletePayment
};
