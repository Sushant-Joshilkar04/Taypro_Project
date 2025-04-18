const User = require('../models/User');
const Payment = require('../models/Payment');
const CleaningStats = require('../models/CleaningStats');

const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const monthlyStats = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Convert monthly stats to the format frontend expects
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const userAcquisitionData = months.map((month, index) => ({
            month,
            users: monthlyStats.find(stat => stat._id === index + 1)?.count || 0
        }));

        res.json({
            totalUsers,
            userAcquisitionData,
            recentActivity: {
                activeUsers: await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24*60*60*1000) }}),
                totalPayments: await Payment.countDocuments(),
                totalRevenue: (await Payment.aggregate([
                    { $match: { status: 'completed' } },
                    { $group: { _id: null, total: { $sum: "$amount" } }}
                ]))[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('userId', 'username email')
            .sort({ date: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password -otp')
            .sort({ createdAt: -1 })
            .lean();

        // Transform the data to ensure all required fields exist
        const formattedUsers = users.map(user => ({
            _id: user._id,
            name: user.name || user.username || 'Unknown User',
            email: user.email || 'No email',
            role: user.role || 'user',
            status: user.status || 'inactive',
            lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
            panels: user.panels || 0
        }));

        res.json(formattedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStats,
    getPayments,
    getUsers
};