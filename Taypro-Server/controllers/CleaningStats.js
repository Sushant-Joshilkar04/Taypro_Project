const CleaningStats = require("../models/CleaningStats");

// Save new cleaning data & emit real-time update
const saveCleaningStats = async (req, res) => {
  try {
    const { layoutId, botId, cleanedPanels, batteryLevel, efficiency, dirtAccumulation } = req.body;

    const newStats = new CleaningStats({
      layoutId,
      botId,
      cleanedPanels,
      totalCycles: cleanedPanels.length,
      efficiency,
      batteryLevel,
      dirtAccumulation,
    });

    await newStats.save();

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("updateCleaningStats", newStats); // Notify all clients

    res.status(201).json({ message: "Cleaning stats saved successfully", data: newStats });
  } catch (error) {
    console.error("Error saving cleaning stats:", error);
    res.status(500).json({ message: "Failed to save cleaning stats" });
  }
};

// ✅ Get latest bot status
const getLatestBotStatus = async (req, res) => {
  try {
    const latestStats = await CleaningStats.findOne().sort({ timestamp: -1 });

    if (!latestStats) {
      return res.status(404).json({ message: "No bot status available" });
    }

    res.json({
      botId: latestStats.botId,
      status: latestStats.status,
      battery: latestStats.battery,
      position: latestStats.position,
      timestamp: latestStats.timestamp
    });
  } catch (error) {
    console.error("Error fetching bot status:", error);
    res.status(500).json({ message: "Failed to fetch bot status" });
  }
};

module.exports = { saveCleaningStats, getLatestBotStatus };
