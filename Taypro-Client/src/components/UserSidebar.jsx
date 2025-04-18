import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiHome, 
    FiClock, 
    FiGrid, 
    FiFileText,
    FiUser,
    FiLogOut,
    FiChevronRight
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import { toast } from 'react-toastify';

const UserSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user.userInfo);
    
    const handleLogout = () => {
        dispatch(logout());
        toast.success('User logged out successfully', {
            className: 'text-l',
        });
        navigate('/login');
    };

    const sidebarItems = [
        {
            title: 'Dashboard',
            icon: <FiHome />,
            path: '/user/dashboard',
        },
        {
            title: 'Schedule Cleaning',
            icon: <FiClock />,
            path: '/user/schedule',
        },
        {
            title: 'Layout Setup',
            icon: <FiGrid />,
            path: '/user/layout-setup',
        },
        {
            title: 'Cleaning History',
            icon: <FiFileText />,
            path: '/user/history',
        }
    ];

    return (
        <div className="h-screen bg-white border-r border-gray-200 shadow-sm" >
            <div className="flex flex-col h-full">
                {/* Header with User Info */}
                <div className="p-6 border-b border-gray-200">
                    <motion.div 
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-800 font-bold">{userInfo?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-gray-800">{userInfo?.username || 'User'}</h1>
                            <p className="text-xs text-gray-500">{userInfo?.email || 'user@example.com'}</p>
                        </div>
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
                                                <FiChevronRight size={16} />
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
                        <FiLogOut size={20} className="text-gray-500" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSidebar; 