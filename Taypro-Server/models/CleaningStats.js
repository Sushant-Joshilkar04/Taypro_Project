const mongoose = require("mongoose");

const CleaningStatsSchema = new mongoose.Schema({
  layoutId: { type: mongoose.Schema.Types.ObjectId, ref: "Layout", required: true }, // Reference to the layout
  botId: { type: String, required: true }, // Unique bot identifier
  cleanedPanels: [
    {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      lastCleanedAt: { type: Date, default: Date.now },
      cleaningCount: { type: Number, default: 1 },
    }
  ],
  totalCycles: { type: Number, default: 0 },
  efficiency: { type: Number, default: 0 }, 
  batteryLevel: { type: Number, required: true }, 
  dirtAccumulation: { type: Number, default: 0 }, 
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CleaningStats", CleaningStatsSchema);
