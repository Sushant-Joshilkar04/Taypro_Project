const CleaningSession = require('../models/CleaningSession');
const User = require('../models/User');
const mongoose = require('mongoose');
const axios = require('axios');

// Schedule a new cleaning session
exports.scheduleCleaningSession = async (req, res) => {
  try {
    const { layoutId, date, time, repeat, cleaningMode } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!layoutId || !date || !time) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields missing' 
      });
    }

    // Validate date is not in the past
    const scheduledDateTime = new Date(`${date}T${time}`);
    if (scheduledDateTime < new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot schedule cleaning in the past' 
      });
    }

    // Get the layout name (in a real implementation, you would fetch this from a Layout model)
    // For now we'll use a placeholder name
    const layoutName = 'Living Room'; // This would be replaced with actual logic

    // Create the cleaning session
    const newSession = new CleaningSession({
      user: userId,
      layoutId,
      layoutName,
      date: scheduledDateTime,
      time,
      repeat: repeat || 'Do not repeat',
      cleaningMode: cleaningMode || 'standard',
      status: 'scheduled'
    });

    await newSession.save();

    return res.status(201).json({
      success: true,
      message: 'Cleaning session scheduled successfully',
      cleaningSession: newSession
    });
  } catch (error) {
    console.error('Error scheduling cleaning session:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while scheduling cleaning session' 
    });
  }
};

// Get upcoming cleaning sessions for a user
exports.getUpcomingCleanings = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all scheduled cleaning sessions for this user
    const upcomingCleanings = await CleaningSession.find({
      user: userId,
      status: 'scheduled',
      date: { $gte: new Date() } // Only future sessions
    }).sort({ date: 1 }); // Sort by date ascending

    return res.status(200).json(upcomingCleanings);
  } catch (error) {
    console.error('Error fetching upcoming cleanings:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching upcoming cleanings' 
    });
  }
};

// Delete a cleaning session
exports.deleteCleaningSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;

    // Validate session ID
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid session ID' 
      });
    }

    // Find and delete the cleaning session, ensuring it belongs to the current user
    const deletedSession = await CleaningSession.findOneAndDelete({
      _id: sessionId,
      user: userId
    });

    if (!deletedSession) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cleaning session not found or not authorized to delete' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cleaning session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting cleaning session:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting cleaning session' 
    });
  }
};

// Get robot status
exports.getRobotStatus = async (req, res) => {
  try {
    // In a real implementation, this would likely come from an IoT device or service
    // For now, we'll return simulated data
    
    // Try to get data from the cleaning stats model, if available
    // If not, provide simulated data
    const robotStatus = {
      connected: false, // Assume no connection for demo
      battery: 74,
      status: 'Charging',
      position: { x: 9, y: 5 } // Position on the grid
    };

    return res.status(200).json(robotStatus);
  } catch (error) {
    console.error('Error fetching robot status:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching robot status' 
    });
  }
}; 