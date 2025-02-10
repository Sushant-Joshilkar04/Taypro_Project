//authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { sendOTP, register, verifyEmail, login, passwordReset, saveLayout, getUserProfile } = require('../controllers/authController');

router.post('/signup', register);
router.post('/email-verification', verifyEmail);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/reset-password', passwordReset);
// Protected route to fetch user info
router.get('/me', passport.authenticate('jwt', { session: false }), getUserProfile);
// router.get('/save-layout', passport.authenticate('jwt', { session: false }), saveLayout);

module.exports = router;
