import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    IconSearch, 
    IconFilter, 
    IconDownload, 
    IconCalendar,
    IconChevronRight,
    IconChevronLeft,
    IconCheck,
    IconX,
    IconClock
} from '@tabler/icons-react';

const Payments = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [dateRange, setDateRange] = useState('all');
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/admin/payments', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPayments(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Filter payments
    const filteredPayments = payments.filter(payment => {
        const matchesSearch = 
            payment.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
            payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
        
        let matchesDate = true;
        const paymentDate = new Date(payment.date);
        const today = new Date();
        
        if (dateRange === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);
            matchesDate = paymentDate >= weekAgo;
        } else if (dateRange === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(today.getMonth() - 1);
            matchesDate = paymentDate >= monthAgo;
        } else if (dateRange === 'quarter') {
            const quarterAgo = new Date();
            quarterAgo.setMonth(today.getMonth() - 3);
            matchesDate = paymentDate >= quarterAgo;
        }
        
        return matchesSearch && matchesStatus && matchesDate;
    });

    // Calculate payment summary
    const completedPayments = filteredPayments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const averagePayment = completedPayments.length > 0 ? totalRevenue / completedPayments.length : 0;

    // Pagination
    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-3xl font-bold text-gray-800">Payment Details</h1>
                <p className="text-gray-600">View and manage customer payment transactions.</p>
            </motion.div>

            {/* Payment Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">From {completedPayments.length} successful payments</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Average Payment</h3>
                    <p className="text-3xl font-bold text-gray-800">${averagePayment.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">Per successful transaction</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Payment Success Rate</h3>
                    <p className="text-3xl font-bold text-gray-800">
                        {payments.length > 0 
                            ? Math.round((completedPayments.length / payments.length) * 100)
                            : 0}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {completedPayments.length} out of {payments.length} transactions
                    </p>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-4"
            >
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <IconSearch size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by user or payment ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                            <IconFilter size={18} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Status:</span>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-transparent text-gray-700 text-sm font-medium focus:outline-none"
                            >
                                <option value="all">All</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                            <IconCalendar size={18} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Period:</span>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="bg-transparent text-gray-700 text-sm font-medium focus:outline-none"
                            >
                                <option value="all">All Time</option>
                                <option value="week">Last Week</option>
                                <option value="month">Last Month</option>
                                <option value="quarter">Last Quarter</option>
                            </select>
                        </div>

                        <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <IconDownload size={18} />
                            <span className="text-sm font-medium">Export</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Payments Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Method
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Plan
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((payment, index) => (
                                <motion.tr 
                                    key={payment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {payment.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <div className="text-sm font-medium text-gray-900">{payment.user}</div>
                                            <div className="text-sm text-gray-500">{payment.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ${payment.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(payment.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                              payment.status === 'failed' ? 'bg-red-100 text-red-800' : 
                                              'bg-gray-100 text-gray-800'}`}>
                                            <span className="flex items-center">
                                                {payment.status === 'completed' ? (
                                                    <IconCheck size={14} className="mr-1" />
                                                ) : payment.status === 'failed' || payment.status === 'refunded' ? (
                                                    <IconX size={14} className="mr-1" />
                                                ) : (
                                                    <IconClock size={14} className="mr-1" />
                                                )}
                                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            </span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {payment.method}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {payment.plan}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                currentPage === 1 ? 'text-gray-400 bg-gray-50' : 'text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                currentPage === totalPages ? 'text-gray-400 bg-gray-50' : 'text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(indexOfLastItem, filteredPayments.length)}
                                </span>{' '}
                                of <span className="font-medium">{filteredPayments.length}</span> payments
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    <IconChevronLeft size={18} />
                                </button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            currentPage === index + 1
                                                ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                        currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    <IconChevronRight size={18} />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Payments;