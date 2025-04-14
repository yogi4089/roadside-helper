// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Create service routes
router.post('/', serviceController.createService);
router.post('/create', serviceController.createService);  // New route for /services/create

// Get services by mechanic name with optional status filter
router.get('/mechanic/:name', serviceController.getServicesByMechanicName);

// Get pending services for mechanic
router.get('/mechanic/:mechanic_id/pending', serviceController.getPendingServices);

// Get completed services by mechanic name
router.get('/mechanic/:mechanic_name/completed', serviceController.getCompletedServicesByMechanicName);

// Get accepted services by mechanic name
router.get('/mechanic/:mechanic_name/accepted', serviceController.getAcceptedServicesByMechanicName);

// Get services by customer ID
router.get('/customer/:customer_id', serviceController.getServicesByCustomerId);
router.get('/services/customer/:customer_id', serviceController.getServicesByCustomerId);

// Update service status routes
router.put('/:id/status', serviceController.updateServiceStatus);
router.put('/services/:id/status', serviceController.updateServiceStatus);

// Get service history
router.get('/history/:user_id/:role', serviceController.getServiceHistory);

module.exports = router; 