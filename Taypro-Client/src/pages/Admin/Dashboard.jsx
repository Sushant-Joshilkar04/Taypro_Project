import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        userAcquisitionData: [],
        recentActivity: {
            activeUsers: 0,
            totalPayments: 0,
            totalRevenue: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back, monitor your site's performance.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                        <span className="text-sm font-medium text-gray-600">Last Updated: </span>
                        <span className="text-sm font-bold text-gray-800">Today, 10:30 AM</span>
                    </div>
                </motion.div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total Users</h3>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Active Users (24h)</h3>
                    <p className="text-3xl font-bold">{stats.recentActivity.activeUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">Total Revenue</h3>
                    <p className="text-3xl font-bold">${stats.recentActivity.totalRevenue}</p>
                </div>
            </div>

            {/* User Acquisition Chart */}
            <motion.div
                className="bg-white rounded-lg shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
            >
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">User Acquisition</h2>
                        <p className="text-sm text-gray-600">Monthly new registered users</p>
                    </div>
                </div>

                <div className="h-64 w-full">
                    <div className="h-full flex items-end justify-between">
                        {stats.userAcquisitionData.map((data, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <motion.div
                                    className="w-12 bg-blue-500 rounded-t-md"
                                    style={{ height: `${(data.users / Math.max(...stats.userAcquisitionData.map(d => d.users))) * 100}%` }}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(data.users / Math.max(...stats.userAcquisitionData.map(d => d.users))) * 100}%` }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <div className="w-full h-full flex items-center justify-center text-white font-medium text-xs">
                                        {data.users}
                                    </div>
                                </motion.div>
                                <span className="text-xs font-medium text-gray-600 mt-2">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;