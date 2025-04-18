const mongoose = require('mongoose');

const CleaningSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  layoutId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  layoutName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  repeat: {
    type: String,
    enum: ['Do not repeat', 'Daily', 'Weekly', 'Monthly'],
    default: 'Do not repeat'
  },
  cleaningMode: {
    type: String,
    enum: ['eco', 'standard', 'deep'],
    default: 'standard'
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'in-progress'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CleaningSession = mongoose.model('CleaningSession', CleaningSessionSchema);

module.exports = CleaningSession; 