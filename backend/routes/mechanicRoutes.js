// routes/mechanicRoutes.js
const express = require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanicController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', mechanicController.registerMechanic);
router.post('/login', mechanicController.loginMechanic);
router.get('/profiles', mechanicController.getMechanicProfiles);

// Protected routes
router.get('/profile', auth, mechanicController.getProfile);
router.get('/services', auth, mechanicController.getServices);
router.put('/services/:serviceId/status', auth, mechanicController.updateServiceStatus);

module.exports = router;
