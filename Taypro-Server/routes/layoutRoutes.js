const express = require('express');
const router = express.Router();
const layoutController = require('../controllers/layoutController');
const passport = require('passport');

// Middleware to protect routes
const authenticate = passport.authenticate('jwt', { session: false });

// All routes use authentication
router.use(authenticate);

// Get all layouts for the logged-in user
router.get('/', layoutController.getLayouts);

// Get a specific layout
router.get('/:id', layoutController.getLayout);

// Create a new layout
router.post('/', layoutController.createLayout);

// Update a layout
router.put('/:id', layoutController.updateLayout);

// Delete a layout
router.delete('/:id', layoutController.deleteLayout);

module.exports = router; 