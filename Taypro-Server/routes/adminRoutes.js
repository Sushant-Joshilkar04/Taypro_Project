const express = require('express');
const router = express.Router();
const { getStats, getPayments, getUsers } = require('../controllers/adminController');
const passport = require('passport');

// Protected admin routes
router.get('/stats', passport.authenticate('jwt', { session: false }), getStats);
router.get('/payments', passport.authenticate('jwt', { session: false }), getPayments);
router.get('/users', passport.authenticate('jwt', { session: false }), getUsers);

module.exports = router;