const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');

router.get('/customer/:customerId', measurementController.getMeasurementsByCustomer);
router.get('/:id', measurementController.getMeasurementById);
router.post('/', measurementController.createMeasurement);
router.put('/:id', measurementController.updateMeasurement);
router.delete('/:id', measurementController.deleteMeasurement);

module.exports = router;
