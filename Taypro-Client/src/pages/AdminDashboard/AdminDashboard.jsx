import React from 'react';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
    const userInfo = useSelector((state) => state.user.userInfo);

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Welcome, {userInfo?.username}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Admin Statistics */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Total Users</h3>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Active Layouts</h3>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">System Status</h3>
                            <p className="text-2xl font-bold text-green-500">Online</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 