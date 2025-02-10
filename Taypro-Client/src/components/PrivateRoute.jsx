import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

const PrivateRoute = () => {
    const userInfo = useSelector((state) => state.user.userInfo);

    useEffect(() => {
        if (!userInfo) {
            toast.error('User not found. Please log in.', {
                className: 'text-l',
            });
        }
    }, []);

    return userInfo ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
