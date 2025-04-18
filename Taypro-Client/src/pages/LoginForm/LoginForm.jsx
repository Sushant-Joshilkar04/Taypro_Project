import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import { IconBrandGoogle } from "@tabler/icons-react";
import BottomGradient from "../../components/BottomGradient";
import { axiosInstance } from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import ReactLoading from 'react-loading';

const LoginForm = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('user');

    const validateForm = (email, password) => {
        if (!email || !password) {
            return "All fields are required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Invalid email address";
        }
        return "valid";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const errorMessage = validateForm(email, password);
        if (errorMessage !== "valid") {
            toast.error(errorMessage, {
                className: 'text-l '
            });
            setLoading(false);
            return;
        }
        await axiosInstance.post('/auth/login', {
            email,
            password,
            role: selectedRole
        }).then((res) => {
            const otpFlag = res.data.otpFlag || false;
            const generatePassword = res.data.generatePassword || false;
            if (otpFlag) {
                toast.warning("Email already exist but not verified", {
                    className: 'text-l'
                });
                toast.success("OTP has been sent to your email", {
                    className: 'text-l'
                });
                navigate('/verifyOTP', { state: { email } });
            }
            else if (generatePassword) {
                toast.info("User signed up through google\nSign in with google or generate a password", {
                    className: 'text-l'
                });
                navigate('/resetPassword', { state: { email } });
            }
            else {
                const { token } = res.data;
                navigate(`/auth/success?token=${token}`)
            }
        }).catch((err) => {
            toast.error(err.response.data.msg, {
                className: ' text-l'
            });
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleForgotPassword = async () => {
        setLoading(true);
        if (!email) {
            toast.error('Please provide the registered email', { className: 'text-l ' });
            setLoading(false);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Invalid email address', { className: 'text-l ' });
            setLoading(false);
            return;
        }
        await axiosInstance.post('/auth/send-otp', {
            email
        }).then((res) => {
            const otpFlag = res.data.otpFlag || false;
            if (otpFlag) {
                toast.success("OTP has been sent to your email", {
                    className: 'text-l'
                });
                const passwordResetFlag = true;
                navigate('/verifyOTP', { state: { email, passwordResetFlag } });
            }
        }).catch((err) => {
            toast.error(err.response.data.msg, {
                className: ' text-l'
            });
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-green-50">
            {/* Left Side - Login Form */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-green-800">
                            Welcome Back
                        </h1>
                        <h2 className="text-3xl font-bold text-green-800">
                            to TayPro
                        </h2>
                        <div className="space-y-2">
                            <p className="text-gray-600">
                                Smart Solar Panel Maintenance
                            </p>
                            <p className="text-sm text-gray-500">
                                Access your automated cleaning dashboard and monitor your solar efficiency
                            </p>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <Input
                                id="email"
                                placeholder="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <Input
                                id="password"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setSelectedRole('user')}
                                className={cn(
                                    "flex-1 py-2 px-4 rounded-md transition-all duration-200",
                                    selectedRole === 'user'
                                        ? "bg-green-600 text-white"
                                        : "bg-green-50 text-gray-700 hover:bg-green-100"
                                )}
                            >
                                User
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRole('admin')}
                                className={cn(
                                    "flex-1 py-2 px-4 rounded-md transition-all duration-200",
                                    selectedRole === 'admin'
                                        ? "bg-green-600 text-white"
                                        : "bg-green-50 text-gray-700 hover:bg-green-100"
                                )}
                            >
                                Admin
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="form-checkbox text-green-600 rounded" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-green-600 hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <ReactLoading type={"spin"} height={24} width={24} color="white" />
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        <div className="text-center">
                            <span className="text-gray-600">Don't have an account? </span>
                            <button
                                type="button"
                                onClick={() => navigate('/signup')}
                                className="text-green-600 hover:underline font-medium"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 p-8">
                <div className="relative w-full max-w-lg">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                    <div className="relative">
                        <img
                            src="https://i.pinimg.com/originals/fd/82/5c/fd825c37b3054d2876c45dc04dff6276.png"
                            className="w-full h-auto max-w-md mx-auto"
                            alt="Smart cleaning illustration"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;

// LabelInputContainer component
const LabelInputContainer = ({ children, className }) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};