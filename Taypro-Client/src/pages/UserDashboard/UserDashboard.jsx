import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import SavedLayouts from "../../components/SavedLayouts";
import { axiosInstance } from "../../utils/axiosConfig";
import { 
  FiClock, 
  FiFileText, 
  FiGrid, 
  FiZap, 
  FiBarChart2, 
  FiSave,
  FiTrendingUp,
  FiCalendar
} from "react-icons/fi";

const UserDashboard = () => {
  const userInfo = useSelector(state => state.user.userInfo);
  const layouts = useSelector(state => state.layout.layouts);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    savedLayouts: 0,
    cleaningHistory: 0,
    monitoringSessions: 0
  });

  // For activity data
  const [recentActivity, setRecentActivity] = useState([
    { title: 'Cleaning completed', time: '2 hours ago', type: 'cleaning' },
    { title: 'New layout created', time: '1 day ago', type: 'layout' },
    { title: 'Maintenance scheduled', time: '3 days ago', type: 'maintenance' }
  ]);

  // Monthly statistics data
  const [monthlyStats] = useState([
    { month: 'Jan', count: 4 },
    { month: 'Feb', count: 6 },
    { month: 'Mar', count: 8 },
    { month: 'Apr', count: 5 },
    { month: 'May', count: 7 },
    { month: 'Jun', count: 9 },
    { month: 'Jul', count: 11 },
    { month: 'Aug', count: 8 },
    { month: 'Sep', count: 12 },
    { month: 'Oct', count: 15 },
    { month: 'Nov', count: 13 },
    { month: 'Dec', count: 9 }
  ]);

  useEffect(() => {
    // Set saved layouts count from Redux store
    setStats(prevStats => ({
      ...prevStats,
      savedLayouts: layouts?.length || 0
    }));

    // Fetch dashboard stats from backend
    const fetchDashboardStats = async () => {
      try {
        const response = await axiosInstance.get('/api/dashboard/stats');
        if (response.data) {
          setStats(prevStats => ({
            ...prevStats,
            ...response.data
          }));
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // If API call fails, use fallback values
        setStats(prevStats => ({
          ...prevStats,
          cleaningHistory: prevStats.cleaningHistory || 0,
          monitoringSessions: prevStats.monitoringSessions || 0
        }));
      }
    };

    fetchDashboardStats();
  }, [layouts]);

  // Find max value for chart scaling
  const maxCount = Math.max(...monthlyStats.map(item => item.count));

  return (
    <div className="space-y-6">
      {/* Header Section with Welcome Message and Last Updated */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userInfo?.username || 'User'}!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="text-sm font-medium text-gray-600">Last Cleaning: </span>
            <span className="text-sm font-bold text-gray-800">Today, 9:45 AM</span>
          </div>
        </motion.div>
      </div>

      {/* Main Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Schedule Cleaning */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FiClock className="text-blue-600 text-xl" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Schedule Cleaning</h2>
          <p className="text-gray-600 text-center mb-4">Set up a new cleaning session for your robot.</p>
          <button 
            onClick={() => navigate('/user/schedule')} 
            className="w-full bg-blue-50 text-blue-600 font-medium py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            Schedule now <span className="ml-1">→</span>
          </button>
        </motion.div>

        {/* Cleaning History */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FiFileText className="text-purple-600 text-xl" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Cleaning History</h2>
          <p className="text-gray-600 text-center mb-4">View past cleaning sessions and statistics.</p>
          <button 
            onClick={() => navigate('/user/history')} 
            className="w-full bg-purple-50 text-purple-600 font-medium py-2 rounded-md hover:bg-purple-100 transition-colors flex items-center justify-center"
          >
            View history <span className="ml-1">→</span>
          </button>
        </motion.div>

        {/* Create Layout */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FiGrid className="text-green-600 text-xl" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Create Layout</h2>
          <p className="text-gray-600 text-center mb-4">Design a new cleaning layout for your space.</p>
          <button 
            onClick={() => navigate('/user/layout-setup')} 
            className="w-full bg-green-50 text-green-600 font-medium py-2 rounded-md hover:bg-green-100 transition-colors flex items-center justify-center"
          >
            Create layout <span className="ml-1">→</span>
          </button>
        </motion.div>
      </div>

      {/* Stats Row */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {/* Saved Layouts */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Saved Layouts</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.savedLayouts || 0}</h3>
              <div className="flex items-center mt-2">
                <span className="flex items-center text-sm font-medium text-green-600">
                  <FiTrendingUp size={16} className="mr-1" />
                  +{stats.savedLayouts > 0 ? Math.round(stats.savedLayouts * 0.1) : 0}%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <FiSave size={24} />
            </div>
          </div>
        </div>

        {/* Cleaning Sessions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Cleaning Sessions</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.cleaningHistory || 23}</h3>
              <div className="flex items-center mt-2">
                <span className="flex items-center text-sm font-medium text-green-600">
                  <FiTrendingUp size={16} className="mr-1" />
                  +18%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg text-white">
              <FiCalendar size={24} />
            </div>
          </div>
        </div>

        {/* Power Generated */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Power Generated</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">1,284 kWh</h3>
              <div className="flex items-center mt-2">
                <span className="flex items-center text-sm font-medium text-green-600">
                  <FiTrendingUp size={16} className="mr-1" />
                  +24%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-green-500 p-3 rounded-lg text-white">
              <FiZap size={24} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Layouts and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Cleaning Activity</h2>
              <p className="text-sm text-gray-600">Monthly cleaning sessions</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm font-medium bg-green-50 text-green-700 rounded-md">
                Monthly
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                Quarterly
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                Yearly
              </button>
            </div>
          </div>

          {/* Simple Chart Implementation */}
          <div className="h-64 w-full">
            <div className="h-full flex items-end justify-between">
              {monthlyStats.map((item, index) => (
                <div key={item.month} className="flex flex-col items-center">
                  <motion.div
                    className="w-12 bg-green-500 rounded-t-md"
                    style={{ height: `${(item.count / maxCount) * 100}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ backgroundColor: '#059669' }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-white font-medium text-xs">
                      {item.count}
                    </div>
                  </motion.div>
                  <span className="text-xs font-medium text-gray-600 mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div 
                key={index}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                  activity.type === 'cleaning' ? 'bg-blue-100 text-blue-500' :
                  activity.type === 'layout' ? 'bg-green-100 text-green-500' :
                  'bg-yellow-100 text-yellow-500'
                }`}>
                  {activity.type === 'cleaning' ? <FiClock size={20} /> :
                   activity.type === 'layout' ? <FiGrid size={20} /> :
                   <FiFileText size={20} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Saved Layouts Section */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Saved Layouts</h2>
        <SavedLayouts />
      </motion.div>
    </div>
  );
};

export default UserDashboard;
