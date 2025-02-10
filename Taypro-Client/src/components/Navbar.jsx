import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/userSlice";

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Fetch user authentication state
    const userInfo = useSelector((state) => state.user.userInfo);
    // console.log(userInfo);

    // Navigation Handlers
    const handleDashboardNavigation = () => navigate("/dashboard");
    const handleLogin = () => navigate("/login");
    const handleSignUp = () => navigate("/signup");
    const handleLogout = () => {
        dispatch(logout());
        toast.success('User logged out successfully', {
            className: 'text-l',
        });
        navigate("/"); // Redirect to home after logout
    };

    return (
        <div className="p-12">
            <nav className="backdrop-blur-md bg-white/50 fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 shadow-md">
                {/* Logo */}
                <img
                    src="/TP_logo.png"
                    alt="Taypro Logo"
                    className="h-10 cursor-pointer"
                    onClick={handleDashboardNavigation}
                />

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
