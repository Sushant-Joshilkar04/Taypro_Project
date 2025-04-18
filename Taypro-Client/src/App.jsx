import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { fetchUserInfo } from './store/slices/userSlice';
import { setAuthToken } from './utils/axiosConfig';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import SignupForm from './pages/SignUpForm/SignUpForm';
import LoginForm from './pages/LoginForm/LoginForm';
import OTPForm from './pages/OTPForm/OTPForm';
import ResetPasswordForm from './pages/ResetPasswordForm/ResetPasswordForm';
import AuthSuccess from './components/AuthSuccess';
import RoleBasedRoute from "./components/RoleBasedRoute";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import NotSupported from "./pages/NotSupported";
import NotFound from "./pages/NotFound";
import BotLocation from "./components/BotLocation";
import CleaningStats from "./components/CleanigStats";
import SchedulePage from "./pages/SchedulePage";
import LayoutSetup from "./pages/LayoutSetup/LayoutSetup";
import Preloader from "./components/Preloader";

// Admin pages
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";
import Payments from "./pages/Admin/Payments";

// User Layout
import UserLayout from "./layouts/UserLayout";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Set token to axios headers
      setAuthToken(token);
      // Fetch user info
      dispatch(fetchUserInfo());
    }
  }, [dispatch]);

  return (
    <div>
      <ToastContainer />
      <Router>
        <Preloader />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/login" element={
            <>
              <Navbar />
              <LoginForm />
              <Footer />
            </>
          } />
          <Route path="/signup" element={
            <>
              <Navbar />
              <SignupForm />
              <Footer />
            </>
          } />
          <Route path="/verifyOTP" element={
            <>
              <Navbar />
              <OTPForm />
              <Footer />
            </>
          } />
          <Route path="/resetPassword" element={
            <>
              <Navbar />
              <ResetPasswordForm />
              <Footer />
            </>
          } />
          <Route path="/auth/success" element={
            <>
              <Navbar />
              <AuthSuccess />
              <Footer />
            </>
          } />
          <Route path="/bot-location" element={
            <>
              <Navbar />
              <BotLocation />
              <Footer />
            </>
          } />
          <Route path="/cleaning-stats" element={
            <>
              <Navbar />
              <CleaningStats />
              <Footer />
            </>
          } />

          {/* User Routes with the UserLayout */}
          <Route element={<RoleBasedRoute allowedRoles={['user']} />}>
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="layout-setup" element={<LayoutSetup />} />
              <Route path="layout-edit" element={<LayoutSetup />} />
              <Route path="history" element={<div>History Page</div>} />
            </Route>
          </Route>

          {/* Admin Routes with the AdminLayout */}
          <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="payments" element={<Payments />} />
            </Route>
          </Route>

          {/* Legacy Routes redirects */}
          <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/schedule" element={<Navigate to="/user/schedule" replace />} />
          <Route path="/layout-setup" element={<Navigate to="/user/layout-setup" replace />} />
          <Route path="/history" element={<Navigate to="/user/history" replace />} />

          {/* Legacy Admin Dashboard */}
          <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={
              <>
                <Navbar />
                <AdminDashboard />
                <Footer />
              </>
            } />
          </Route>

          {/* Error Pages */}
          <Route path="/not-supported" element={
            <>
              <Navbar />
              <NotSupported />
              <Footer />
            </>
          } />
          <Route path="/*" element={
            <>
              <Navbar />
              <NotFound />
              <Footer />
            </>
          } />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
