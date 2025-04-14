// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getProfile,
  getServiceHistory,
} = require('../controllers/customerController');
const auth = require('../middleware/auth');

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.get('/profile', auth, getProfile);
router.get('/history', auth, getServiceHistory);

module.exports = router;