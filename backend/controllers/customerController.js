// controllers/customerController.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerCustomer = async (req, res) => {
  console.log('Registration request received:', req.body);
  const { name, email, password, contact, gender } = req.body;
  
  // Validate required fields
  if (!name || !email || !password) {
    console.log('Missing required fields:', { name, email, password });
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  
  try {
    // Check if email already exists
    console.log('Checking if email exists:', email);
    const emailCheck = await pool.query('SELECT * FROM customer WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      console.log('Email already registered:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new customer
    console.log('Inserting new customer');
    const result = await pool.query(
      'INSERT INTO customer(name, email, password, contact, gender) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, contact, gender',
      [name, email, hashedPassword, contact, gender]
    );
    console.log('Customer inserted successfully:', result.rows[0]);
    
    // Return success
    res.status(201).json({
      message: 'Registration successful',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
    res.status(500).json({ 
      error: 'Registration failed. Please try again.',
      details: error.message
    });
  }
};

exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);
  
  try {
    const result = await pool.query('SELECT * FROM customer WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      console.log('No user found with email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, result.rows[0].password);
    if (!valid) {
      console.log('Invalid password for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: result.rows[0].id, role: 'customer' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', result.rows[0].name);
    
    res.json({ 
      message: 'Login successful',
      token,
      customer: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        contact: result.rows[0].contact,
        gender: result.rows[0].gender
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, contact, gender FROM customer WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getServiceHistory = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT m.name as mechanic_name, m.phone, s.date FROM service_history s JOIN mechanics m ON s.mechanic_id = m.id WHERE s.customer_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
