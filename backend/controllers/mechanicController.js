// controllers/mechanicController.js
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerMechanic = async (req, res) => {
  try {
    const { name, email, password, phone, location, service_category, storeName, contact, license, address, category } = req.body;
    
    console.log('Received registration request body:', req.body);
    
    // Map the fields correctly
    const mechanicData = {
      name: name,
      email: email,
      password: password,
      phone: contact || phone, // Use contact if available, otherwise use phone
      location: address || location, // Use address if available, otherwise use location
      service_category: category || service_category // Use category if available, otherwise use service_category
    };
    
    console.log('Mapped mechanic data:', mechanicData);
    
    // Validate required fields
    if (!mechanicData.name || !mechanicData.email || !mechanicData.password || !mechanicData.service_category) {
      console.log('Missing required fields:', mechanicData);
      return res.status(400).json({ error: 'Name, email, password, and service category are required' });
    }
    
    // Check if email already exists
    const emailCheck = await pool.query('SELECT * FROM mechanics WHERE email = $1', [mechanicData.email]);
    if (emailCheck.rows.length > 0) {
      console.log('Email already exists:', mechanicData.email);
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(mechanicData.password, 10);
    
    // Insert new mechanic
    const result = await pool.query(
      'INSERT INTO mechanics(name, email, password, phone, location, service_category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, phone, location, service_category',
      [mechanicData.name, mechanicData.email, hashedPassword, mechanicData.phone, mechanicData.location, mechanicData.service_category]
    );
    
    console.log('Mechanic registered successfully:', result.rows[0]);
    
    // Return success
    res.status(201).json({
      message: 'Registration successful',
      mechanic: result.rows[0]
    });
  } catch (error) {
    console.error('Detailed registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Registration failed. Please try again.',
      details: error.message 
    });
  }
};

exports.loginMechanic = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM mechanics WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, result.rows[0].password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { id: result.rows[0].id, role: 'mechanic' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Login successful',
      token,
      mechanic: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, phone, location, service_category FROM mechanics WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMechanicProfiles = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, phone, location FROM mechanics');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getServices = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.status,
        s.date,
        s.description,
        c.name as customer_name,
        c.contact as customer_contact
      FROM service_history s
      JOIN customer c ON s.customer_id = c.id
      WHERE s.mechanic_id = $1
      ORDER BY s.date DESC
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
};

exports.updateServiceStatus = async (req, res) => {
  const { serviceId } = req.params;
  const { status } = req.body;
  
  try {
    // Check if service exists and belongs to the mechanic
    const serviceCheck = await pool.query(
      'SELECT * FROM service_history WHERE id = $1 AND mechanic_id = $2',
      [serviceId, req.user.id]
    );
    
    if (serviceCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    // Update service status
    const result = await pool.query(
      'UPDATE service_history SET status = $1 WHERE id = $2 RETURNING *',
      [status, serviceId]
    );
    
    res.json({
      message: 'Service status updated successfully',
      service: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating service status:', error);
    res.status(500).json({ error: 'Failed to update service status' });
  }
};