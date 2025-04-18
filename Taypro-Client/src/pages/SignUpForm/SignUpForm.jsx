import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import { IconBrandGoogle } from "@tabler/icons-react";
import BottomGradient from '../../components/BottomGradient';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import ReactLoading from 'react-loading';

export function SignupForm() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = (username, email, password, confirmPassword) => {
        if (!username || !email || !password || !confirmPassword) {
            return "All fields are required";
        }
        if (password !== confirmPassword) {
            return "Passwords do not match";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Invalid email address";
        }
        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        return "valid";
    };

    const postData = async () => {
        await axiosInstance.post('/auth/signup', {
            username,
            email,
            password
        }).then((res) => {
            toast.success("OTP has been sent to your email", {
                className: 'text-l'
            });
            navigate('/verifyOTP', { state: { email } });
        }).catch((err) => {
            toast.error(err.response.data.msg, {
                className: 'text-l'
            });
        }).finally(() => {
            setLoading(false);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const errorMessage = validateForm(username, email, password, confirmPassword);
        if (errorMessage !== "valid") {
            toast.error(errorMessage, {
                className: 'text-l '
            });
            setLoading(false);
            return;
        }
        postData();
    }

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-green-50">
            {/* Left Side - Signup Form */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-green-800">
                            Join TayPro
                        </h1>
                        <h2 className="text-3xl font-bold text-green-800">
                            Create Account
                        </h2>
                        <div className="space-y-2">
                            <p className="text-gray-600">
                                Revolutionizing Solar Panel Cleaning
                            </p>
                            <p className="text-sm text-gray-500">
                                Join our innovative platform for automated and efficient solar panel maintenance
                            </p>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <Input
                                id="username"
                                placeholder="Username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        
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
                        
                        <div>
                            <Input
                                id="confirmpassword"
                                placeholder="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <button
                            className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <ReactLoading type={"spin"} height={24} width={24} color="white" />
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <div className="text-center">
                            <span className="text-gray-600">Already have an account? </span>
                            <button 
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-green-600 hover:underline font-medium"
                            >
                                Sign In
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
                            src="https://i.pinimg.com/originals/e3/f9/c4/e3f9c42f3b449e72123466d80fc5f18b.png"
                            className="w-full h-auto max-w-md mx-auto"
                            alt="Solar panel cleaning illustration"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupForm;
