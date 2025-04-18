const CleaningStats = require('../models/CleaningStats');
const Layout = require('../models/Layout');
const User = require('../models/User');

// Get dashboard statistics for the authenticated user
exports.getDashboardStats = async (req, res) => {
    try {
        // Get the user ID from the authenticated request
        const userId = req.user.id;

        // Count layouts for this user
        const layoutCount = await Layout.countDocuments({ user: userId });

        // Count cleaning sessions
        const cleaningHistoryCount = await CleaningStats.countDocuments({ user: userId });

        // You can add more statistics as needed
        const stats = {
            savedLayouts: layoutCount,
            cleaningHistory: cleaningHistoryCount,
            monitoringSessions: 0, // Set to 0 or query from a monitoring table if you have one
            // Add any other stats you need here
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 