const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const passport = require('passport');

// Middleware to protect routes
const authenticate = passport.authenticate('jwt', { session: false });

// All routes use authentication
router.use(authenticate);

// Get dashboard statistics for the authenticated user
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router; 