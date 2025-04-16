const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get admin dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        // Get total registered customers
        const userStats = await db.query(`
            SELECT COUNT(*) as total_users
            FROM customer
        `);

        // Get total registered mechanics
        const mechanicStats = await db.query(`
            SELECT COUNT(*) as total_mechanics
            FROM mechanics
        `);

        // Get pending and accepted requests count
        const requestStats = await db.query(`
            SELECT COUNT(*) as pending_requests
            FROM services
            WHERE status IN ('pending', 'accepted')
        `);

        // Set static revenue
        const revenue = 0;

        // Get request trend data
        const requestTrend = await db.query(`
            SELECT 
                DATE_TRUNC('day', created_at) as date,
                COUNT(*) as count
            FROM services
            WHERE created_at >= NOW() - INTERVAL '7 days'
            GROUP BY DATE_TRUNC('day', created_at)
            ORDER BY date
        `);

        // Get user growth trend
        const userTrend = await db.query(`
            SELECT 
                DATE_TRUNC('day', created_at) as date,
                COUNT(*) as count
            FROM customer
            WHERE created_at >= NOW() - INTERVAL '7 days'
            GROUP BY DATE_TRUNC('day', created_at)
            ORDER BY date
        `);

        // Get recent activity
        const recentActivity = await db.query(`
            (SELECT 
                'user' as type,
                name as title,
                created_at as time
            FROM customer
            WHERE created_at >= NOW() - INTERVAL '24 hours')
            UNION ALL
            (SELECT 
                'service' as type,
                service_type as title,
                created_at as time
            FROM services
            WHERE created_at >= NOW() - INTERVAL '24 hours')
            ORDER BY time DESC
            LIMIT 10
        `);

        // Set all changes to 0
        const userChange = 0;
        const mechanicChange = 0;
        const requestChange = 0;
        const revenueChange = 0;

        // Format trend data
        const formatTrendData = (data) => ({
            labels: data.rows.map(row => new Date(row.date).toLocaleDateString()),
            values: data.rows.map(row => parseInt(row.count))
        });

        res.json({
            activeUsers: userStats.rows[0].total_users,
            activeMechanics: mechanicStats.rows[0].total_mechanics,
            pendingRequests: requestStats.rows[0].pending_requests,
            revenue: revenue,
            userChange,
            mechanicChange,
            requestChange,
            revenueChange,
            requestsTrend: formatTrendData(requestTrend),
            usersTrend: formatTrendData(userTrend),
            recentActivity: recentActivity.rows.map(activity => ({
                type: activity.type,
                title: activity.title,
                time: new Date(activity.time).toLocaleString()
            }))
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to calculate percentage change
function calculatePercentageChange(current, previous) {
    if (!previous) return 0;
    return Math.round(((current - previous) / previous) * 100);
}

module.exports = router;
