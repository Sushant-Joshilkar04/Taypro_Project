const express = require('express');
const router = express.Router();
const cleaningController = require('../controllers/cleaningController');
const { verifyJWT } = require('../middleware/authMiddleware');

// Apply JWT verification to all routes
router.use(verifyJWT);

// Schedule a new cleaning session
router.post('/schedule', cleaningController.scheduleCleaningSession);

// Get upcoming cleaning sessions
router.get('/upcoming', cleaningController.getUpcomingCleanings);

// Delete a cleaning session
router.delete('/:id', cleaningController.deleteCleaningSession);

// Get robot status
router.get('/robot-status', cleaningController.getRobotStatus);

module.exports = router; 