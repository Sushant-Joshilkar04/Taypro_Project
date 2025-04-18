import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/userSlice";
import { toast } from "react-toastify";

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // Fetch user authentication state
    const userInfo = useSelector((state) => state.user.userInfo);
    // console.log(userInfo);

    // Navigation Handlers
    const handleDashboardNavigation = () => navigate("/user/dashboard");
    const handleLogin = () => navigate("/login");
    const handleSignUp = () => navigate("/signup");
    
    // Scroll handlers for homepage sections
    const handleHome = () => {
        if (location.pathname === '/') {
            // If already on homepage, scroll to top (hero section)
            document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Navigate to homepage
            navigate("/");
        }
    };
    
    const handleAbout = () => {
        if (location.pathname === '/') {
            // If on homepage, scroll to About section
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Navigate to homepage with hash for About section
            navigate("/#about");
        }
    };
    
    const handleContact = () => {
        if (location.pathname === '/') {
            // If on homepage, scroll to Contact section
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Navigate to homepage with hash for Contact section
            navigate("/#contact");
        }
    };
    
    const handleLogout = () => {
        dispatch(logout());
        toast.success('User logged out successfully', {
            className: 'text-l',
        });
        navigate("/"); // Redirect to home after logout
    };

    return (
        <div className="p-12">
            <nav className="backdrop-blur-md bg-white/50 fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 shadow-md z-50">
                {/* Logo and Company Name */}
                <div className="flex items-center space-x-2 cursor-pointer" onClick={handleHome}>
                    <img
                        src="https://images.unsplash.com/photo-1611365892117-baa39d74b924?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50&q=80"
                        alt="TayPro Logo"
                        className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="text-xl font-bold text-green-800">TayPro</span>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-6">
                    <button 
                        onClick={handleHome}
                        className="text-gray-700 hover:text-green-800 font-medium transition-colors"
                    >
                        Home
                    </button>
                    <button 
                        onClick={handleAbout}
                        className="text-gray-700 hover:text-green-800 font-medium transition-colors"
                    >
                        About Us
                    </button>
                    <button 
                        onClick={handleContact}
                        className="text-gray-700 hover:text-green-800 font-medium transition-colors"
                    >
                        Contact Us
                    </button>
                </div>

                {/* User Authentication Section */}
                <div className="flex items-center space-x-4">
                    {/* If User is Logged In */}
                    {userInfo ? (
                        <div className="flex space-x-4">
                            {/* User Avatar */}
                            <div className="flex items-center space-x-2">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${userInfo.username}`} // Dynamic avatar using username
                                    alt="User Avatar"
                                    className="h-8 w-8 rounded-full border"
                                />
                                <span className="font-medium text-gray-700">{userInfo.username}</span>
                            </div>
                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        // If User is Not Logged In
                        <>
                            <button
                                onClick={handleLogin}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Login
                            </button>
                            <button
                                onClick={handleSignUp}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
