import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-green-50">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
                <AdminSidebar />
            </div>
            
            {/* Main Content */}
            <motion.div 
                className="flex-1 overflow-auto p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Outlet />
            </motion.div>
        </div>
    );
};

export default AdminLayout; 