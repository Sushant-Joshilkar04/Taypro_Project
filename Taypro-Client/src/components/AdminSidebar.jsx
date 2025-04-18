import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import { toast } from 'react-toastify';
import { 
    IconDashboard, 
    IconUsers, 
    IconCreditCard, 
    IconLogout,
    IconChevronRight
} from '@tabler/icons-react';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleLogout = () => {
        dispatch(logout());
        toast.success('Admin logged out successfully', {
            className: 'text-l',
        });
        navigate('/login');
    };
    
    const sidebarItems = [
        {
            title: 'Dashboard',
            icon: <IconDashboard />,
            path: '/admin/dashboard',
        },
        {
            title: 'Manage Users',
            icon: <IconUsers />,
            path: '/admin/users',
        },
        {
            title: 'Payment Details',
            icon: <IconCreditCard />,
            path: '/admin/payments',
        }
    ];

    return (
        <div className="h-screen bg-white border-r border-gray-200 shadow-sm">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <motion.div 
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                            <span className="text-white font-bold">T</span>
                        </div>
                        <h1 className="text-xl font-bold text-green-800">TayPro Admin</h1>
                    </motion.div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {sidebarItems.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            
                            return (
                                <motion.li 
                                    key={item.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Link 
                                        to={item.path}
                                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-green-50 text-green-700' 
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className={isActive ? 'text-green-700' : 'text-gray-500'}>
                                                {item.icon}
                                            </span>
                                            <span className="font-medium">{item.title}</span>
                                        </div>
                                        {isActive && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-green-700"
                                            >
                                                <IconChevronRight size={16} />
                                            </motion.span>
                                        )}
                                    </Link>
                                </motion.li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 w-full"
                    >
                        <IconLogout size={20} className="text-gray-500" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar; 