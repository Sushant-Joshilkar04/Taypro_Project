import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../store/slices/userSlice';
import { setAuthToken } from '../utils/axiosConfig';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const status = useSelector((state) => state.user.status);
    const error = useSelector((state) => state.user.error);
    const userInfo = useSelector((state) => state.user.userInfo);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenParam = params.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            toast.error('No token found in URL', {
                className: 'text-l',
            });
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (token) {
            // Set token in localStorage
            localStorage.setItem('token', token);
            // Set token in axios headers
            setAuthToken(token);
            // Fetch user info
            dispatch(fetchUserInfo());
        }
    }, [token, dispatch]);

    useEffect(() => {
        if (status === 'succeeded' && userInfo) {
            toast.success('User logged in successfully', {
                className: 'text-l',
            });
            // Redirect based on user role
            if (userInfo.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } else if (status === 'failed') {
            toast.error('Error fetching user: ' + error, {
                className: 'text-l',
            });
            // Clear token on authentication error
            localStorage.removeItem('token');
            setAuthToken(null);
            navigate('/login');
        }
    }, [status, error, navigate, userInfo]);

    return null;
};

export default AuthSuccess;
