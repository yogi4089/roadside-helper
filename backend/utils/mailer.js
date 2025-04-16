/**
 * Email utility module for sending notifications to mechanics
 * Uses Nodemailer with Gmail SMTP
 */
const nodemailer = require('nodemailer');

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send an email to a mechanic
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @returns {Promise} - Promise that resolves when email is sent
 */
async function sendEmailToMechanic(to, subject, htmlContent) {
    try {
        // Setup email options
        const mailOptions = {
            from: `"Roadside Helper" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

/**
 * Format service request data into HTML email content
 * @param {Object} requestData - Service request data
 * @returns {string} - HTML content for email
 */
function formatServiceRequestEmail(requestData) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
            }
            .header {
                background-color: #1e3c72;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
            }
            .content {
                padding: 20px;
                border: 1px solid #ddd;
                border-top: none;
                border-radius: 0 0 5px 5px;
            }
            .info-item {
                margin-bottom: 10px;
            }
            .info-label {
                font-weight: bold;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 0.8em;
                color: #777;
            }
            .button {
                display: inline-block;
                background-color: #1e3c72;
                color: white;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>New Service Request</h1>
        </div>
        <div class="content">
            <p>Dear ${requestData.mechanicName},</p>
            <p>A new service request has been submitted that requires your attention:</p>
            
            <div class="info-item">
                <span class="info-label">Customer Name:</span> ${requestData.customerName}
            </div>
            <div class="info-item">
                <span class="info-label">Contact Number:</span> ${requestData.contactNumber}
            </div>
            <div class="info-item">
                <span class="info-label">Service Type:</span> ${requestData.serviceType}
            </div>
            <div class="info-item">
                <span class="info-label">Location:</span> ${requestData.location}
            </div>
            <div class="info-item">
                <span class="info-label">Description:</span> ${requestData.description}
            </div>
            <div class="info-item">
                <span class="info-label">Requested Time:</span> ${new Date(requestData.createdAt).toLocaleString()}
            </div>
            
            <p>Please log in to your account to accept or decline this request.</p>
            
            <a href="https://roadside-helper.onrender.com/meclogin.html" class="button">Log In Now</a>
            
            <p>Thank you for your prompt attention to this matter.</p>
            <p>Best regards,<br>Roadside Helper Team</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Roadside Helper. All rights reserved.</p>
        </div>
    </body>
    </html>
    `;
}

module.exports = {
    sendEmailToMechanic,
    formatServiceRequestEmail
};
