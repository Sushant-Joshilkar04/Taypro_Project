import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../store/slices/userSlice';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const status = useSelector((state) => state.user.status);
    const error = useSelector((state) => state.user.error);
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
            localStorage.setItem('token', token);
            dispatch(fetchUserInfo());
        }
    }, [token, dispatch]);

    useEffect(() => {
        if (status === 'succeeded') {
            toast.success('User logged in successfully', {
                className: 'text-l',
            });
            navigate('/dashboard');
        } else if (status === 'failed') {
            toast.error('Error fetching user: ' + error, {
                className: 'text-l',
            });
            navigate('/login');
        }
    }, [status, error, navigate]);

    return null;
};

export default AuthSuccess;
