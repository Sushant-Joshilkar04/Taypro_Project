import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import SignupForm from './pages/SignUpForm/SignUpForm';
import LoginForm from './pages/LoginForm/LoginForm';
import OTPForm from './pages/OTPForm/OTPForm';
import ResetPasswordForm from './pages/ResetPasswordForm/ResetPasswordForm';
import AuthSuccess from './components/AuthSuccess';
import PrivateRoute from "./components/PrivateRoute";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import LayoutSetup from "./pages/LayoutSetup/LayoutSetup";
import NotSupported from "./pages/NotSupported";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/verifyOTP" element={<OTPForm />} />
          <Route path="/resetPassword" element={<ResetPasswordForm />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/setup-layout" element={<LayoutSetup />} />
          </Route>
          <Route path="/not-supported" element={<NotSupported />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>

    </div>)
};

export default App;
