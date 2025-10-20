const db = require('../config/database');

// Get all measurements for a customer
const getMeasurementsByCustomer = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM measurements WHERE customer_id = ? ORDER BY created_at DESC',
            [req.params.customerId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get measurement by ID
const getMeasurementById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM measurements WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Measurement not found' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create new measurement
const createMeasurement = async (req, res) => {
    try {
        const {
            customer_id, measurement_type, chest, waist, shoulder, sleeve_length,
            shirt_length, neck, pant_length, pant_waist, hip, thigh, knee, bottom, notes
        } = req.body;

        if (!customer_id || !measurement_type) {
            return res.status(400).json({ success: false, message: 'Customer ID and measurement type are required' });
        }

        // Convert empty strings and null to actual null for database
        const parseValue = (val) => (val === '' || val === null || val === undefined) ? null : parseFloat(val);

        const [result] = await db.query(
            `INSERT INTO measurements (customer_id, measurement_type, chest, waist, shoulder, 
            sleeve_length, shirt_length, neck, pant_length, pant_waist, hip, thigh, knee, bottom, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                customer_id, 
                measurement_type, 
                parseValue(chest), 
                parseValue(waist), 
                parseValue(shoulder), 
                parseValue(sleeve_length), 
                parseValue(shirt_length), 
                parseValue(neck), 
                parseValue(pant_length), 
                parseValue(pant_waist), 
                parseValue(hip), 
                parseValue(thigh), 
                parseValue(knee), 
                parseValue(bottom), 
                notes || null
            ]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Measurement created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Error creating measurement:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update measurement
const updateMeasurement = async (req, res) => {
    try {
        const {
            measurement_type, chest, waist, shoulder, sleeve_length,
            shirt_length, neck, pant_length, pant_waist, hip, thigh, knee, bottom, notes
        } = req.body;

        // Convert empty strings and null to actual null for database
        const parseValue = (val) => (val === '' || val === null || val === undefined) ? null : parseFloat(val);

        const [result] = await db.query(
            `UPDATE measurements SET measurement_type = ?, chest = ?, waist = ?, shoulder = ?, 
            sleeve_length = ?, shirt_length = ?, neck = ?, pant_length = ?, pant_waist = ?, 
            hip = ?, thigh = ?, knee = ?, bottom = ?, notes = ? WHERE id = ?`,
            [
                measurement_type, 
                parseValue(chest), 
                parseValue(waist), 
                parseValue(shoulder), 
                parseValue(sleeve_length), 
                parseValue(shirt_length), 
                parseValue(neck), 
                parseValue(pant_length), 
                parseValue(pant_waist), 
                parseValue(hip), 
                parseValue(thigh), 
                parseValue(knee), 
                parseValue(bottom), 
                notes || null, 
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Measurement not found' });
        }

        res.json({ success: true, message: 'Measurement updated successfully' });
    } catch (error) {
        console.error('Error updating measurement:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete measurement
const deleteMeasurement = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM measurements WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Measurement not found' });
        }

        res.json({ success: true, message: 'Measurement deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getMeasurementsByCustomer,
    getMeasurementById,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement
};
