import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import { fetchUserInfo } from '../store/slices/userSlice';

const RoleBasedRoute = ({ allowedRoles }) => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const status = useSelector((state) => state.user.status);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we have a token but no user info or if userInfo is still loading
        const token = localStorage.getItem('token');
        if (token && (!userInfo || status === 'idle')) {
            dispatch(fetchUserInfo());
        }
    }, [userInfo, status, dispatch]);

    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
        toast.error('Please log in to continue.', {
            className: 'text-l',
        });
        return <Navigate to="/login" />;
    }

    // Check if user info is loading
    if (status === 'loading' || (status === 'idle' && token)) {
        return <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
        </div>;
    }

    // If we have user info but don't have the right role
    if (userInfo && !allowedRoles.includes(userInfo.role)) {
        toast.error('Access denied. Insufficient permissions.', {
            className: 'text-l',
        });
        return <Navigate to={userInfo.role === 'admin' ? '/admin/dashboard' : '/dashboard'} />;
    }

    // If we don't have user info even after trying to fetch it
    if (!userInfo && status !== 'loading') {
        toast.error('Please log in to continue.', {
            className: 'text-l',
        });
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default RoleBasedRoute; 