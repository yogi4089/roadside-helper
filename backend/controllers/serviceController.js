const pool = require('../config/db');
const { sendEmailToMechanic, formatServiceRequestEmail } = require('../utils/mailer');

exports.createService = async (req, res) => {
    try {
        const { 
            customer_id, 
            customer_name, 
            mechanic_id, 
            mechanic_name, 
            service_type, 
            vehicle_type, 
            location,
            contact_number,
            description, 
            status 
        } = req.body;
        
        const result = await pool.query(
            `INSERT INTO services 
            (customer_id, customer_name, mechanic_id, mechanic_name, service_type, vehicle_type, location, contact_number, description, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
            [customer_id, customer_name, mechanic_id, mechanic_name, service_type, vehicle_type, location, contact_number, description, status]
        );

        // Get the mechanic's email from the database
        const mechanicResult = await pool.query(
            'SELECT email FROM mechanics WHERE id = $1',
            [mechanic_id]
        );

        if (mechanicResult.rows.length > 0) {
            const mechanicEmail = mechanicResult.rows[0].email;
            
            // Prepare email data
            const serviceData = {
                mechanicName: mechanic_name,
                customerName: customer_name,
                contactNumber: contact_number,
                serviceType: service_type,
                location: location,
                description: description,
                createdAt: result.rows[0].created_at
            };

            try {
                // Format email content
                const emailContent = formatServiceRequestEmail(serviceData);
                
                // Send email to mechanic
                await sendEmailToMechanic(
                    mechanicEmail,
                    `New Service Request: ${service_type}`,
                    emailContent
                );
                
                console.log(`Email notification sent to mechanic ${mechanic_name} at ${mechanicEmail}`);
            } catch (emailError) {
                // Log email error but don't fail the request
                console.error('Error sending email notification:', emailError);
            }
        } else {
            console.error(`Mechanic email not found for ID: ${mechanic_id}`);
        }

        res.status(201).json({
            message: 'Service request created successfully',
            service: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getPendingServices = async (req, res) => {
    try {
        const { mechanic_id } = req.params;
        const result = await pool.query(
            'SELECT * FROM services WHERE mechanic_id = $1 AND status = $2 ORDER BY created_at DESC',
            [mechanic_id, 'pending']
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching pending services:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getOngoingServices = async (req, res) => {
    try {
        const { mechanic_id } = req.params;
        const result = await pool.query(
            'SELECT * FROM services WHERE mechanic_id = $1 AND status = $2 ORDER BY created_at DESC',
            [mechanic_id, 'accepted']
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching ongoing services:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        console.log('Updating service status:', { id, status });
        
        // Validate status
        const validStatuses = ['accepted', 'rejected', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status. Must be one of: accepted, rejected, completed' 
            });
        }

        // First check if service exists and is in pending status for accept/reject
        const checkResult = await pool.query(
            'SELECT status FROM services WHERE id = $1',
            [id]
        );

        console.log('Check result:', checkResult.rows);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Service not found' 
            });
        }

        const currentStatus = checkResult.rows[0].status;

        // Different validation based on the requested status change
        if (status === 'completed') {
            // Only accepted services can be completed
            if (currentStatus !== 'accepted') {
                return res.status(400).json({ 
                    success: false, 
                    message: `Service must be in 'accepted' status to be completed. Current status: ${currentStatus}` 
                });
            }
        } else if (status === 'accepted' || status === 'rejected') {
            // Only pending services can be accepted or rejected
            if (currentStatus !== 'pending') {
                return res.status(400).json({ 
                    success: false, 
                    message: `Service must be in 'pending' status to be accepted or rejected. Current status: ${currentStatus}` 
                });
            }
        }

        // Update service status
        const result = await pool.query(
            'UPDATE services SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        console.log('Update result:', result.rows[0]);

        res.json({ 
            success: true, 
            message: `Service ${status} successfully`,
            service: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating service status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating service status',
            error: error.message 
        });
    }
};

exports.getServiceHistory = async (req, res) => {
    try {
        const { user_id, role } = req.params;
        let query;
        let params;

        if (role === 'customer') {
            query = 'SELECT * FROM services WHERE customer_id = $1 AND status = $2 ORDER BY completed_at DESC';
            params = [user_id, 'completed'];
        } else {
            query = 'SELECT * FROM services WHERE mechanic_id = $1 AND status = $2 ORDER BY completed_at DESC';
            params = [user_id, 'completed'];
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching service history:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getServicesByMechanicName = async (req, res) => {
    try {
        const { name } = req.params;
        const { status } = req.query;
        console.log(`Fetching services for mechanic: ${name}, status: ${status}`);

        // Debug: First get ALL services for this mechanic to verify data
        const allServices = await pool.query(
            `SELECT id, mechanic_name, status FROM services WHERE LOWER(mechanic_name) = LOWER($1)`,
            [name]
        );
        console.log('All services found for mechanic:', allServices.rows);

        // Main query for services with specific status
        let query = `
            SELECT 
                s.id, 
                s.service_type, 
                s.vehicle_type, 
                s.location, 
                s.description,
                s.status, 
                s.created_at,
                s.customer_name,
                s.contact_number
            FROM services s
            WHERE LOWER(s.mechanic_name) = LOWER($1)
        `;
        const params = [name];

        if (status) {
            query += ` AND s.status = $2`;
            params.push(status);
        }

        query += ` ORDER BY s.created_at DESC`;

        console.log('Executing query:', query);
        console.log('With params:', params);

        const result = await pool.query(query, params);
        console.log(`Found ${result.rows.length} services for mechanic ${name} with status ${status || 'any'}`);
        console.log('Services:', result.rows);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching services by mechanic name:', error);
        res.status(500).json({ 
            error: 'Failed to fetch services',
            details: error.message,
            mechanic: req.params.name,
            status: req.query.status
        });
    }
};

exports.getServicesByCustomerId = async (req, res) => {
    try {
        const { customer_id } = req.params;
        console.log('Fetching services for customer:', customer_id);
        
        const result = await pool.query(
            `SELECT * FROM services 
            WHERE customer_id = $1 
            ORDER BY created_at DESC`,
            [customer_id]
        );
        
        console.log('Query result:', result.rows);
        res.json(result.rows || []);
    } catch (error) {
        console.error('Error fetching services by customer ID:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCompletedServicesByMechanicName = async (req, res) => {
    try {
        const { mechanic_name } = req.params;
        console.log('Fetching completed services for mechanic:', mechanic_name);
        
        const result = await pool.query(
            `SELECT DISTINCT ON (id) 
                id, customer_id, customer_name, mechanic_id, mechanic_name, 
                service_type, vehicle_type, location, description, status, 
                created_at, updated_at, contact_number
            FROM services 
            WHERE mechanic_name = $1 AND status = 'completed'
            ORDER BY id DESC`,
            [mechanic_name]
        );
        
        console.log('Completed services query result:', result.rows);
        res.json(result.rows || []);
    } catch (error) {
        console.error('Error fetching completed services:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updatePendingServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log('Updating pending service status:', { id, status });

        // Validate status
        const validStatuses = ['accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid status. Must be either accepted or rejected' 
            });
        }

        // First check if service exists and is in pending status
        const checkResult = await pool.query(
            'SELECT status FROM services WHERE id = $1',
            [id]
        );

        console.log('Check result:', checkResult.rows);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Service not found' 
            });
        }

        if (checkResult.rows[0].status !== 'pending') {
            return res.status(400).json({ 
                success: false, 
                message: `Service must be in 'pending' status to be updated. Current status: ${checkResult.rows[0].status}` 
            });
        }

        // Update service status
        const result = await pool.query(
            'UPDATE services SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        console.log('Update result:', result.rows[0]);

        res.json({ 
            success: true, 
            message: `Service ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`,
            service: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating service status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating service status',
            error: error.message 
        });
    }
};

exports.getAcceptedServicesByMechanicName = async (req, res) => {
    try {
        const { mechanic_name } = req.params;
        console.log('Fetching accepted services for mechanic:', mechanic_name);

        // Debug: First get ALL services for this mechanic
        const allServices = await pool.query(
            `SELECT id, mechanic_name, status FROM services WHERE LOWER(mechanic_name) = LOWER($1)`,
            [mechanic_name]
        );
        console.log('All services found for mechanic:', allServices.rows);
        
        // Get accepted services
        const result = await pool.query(
            `SELECT * FROM services 
            WHERE LOWER(mechanic_name) = LOWER($1) 
            AND status = 'accepted' 
            ORDER BY created_at DESC`,
            [mechanic_name]
        );
        
        console.log('Accepted services found:', result.rows);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching accepted services:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching accepted services',
            error: error.message 
        });
    }
}; 