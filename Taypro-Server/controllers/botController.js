const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();

const THINGSPEAK_CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID;
const THINGSPEAK_API_KEY = process.env.THINGSPEAK_API_KEY;
console.log("ThingSpeak Channel:", THINGSPEAK_CHANNEL_ID); 

const THINGSPEAK_URL = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=1`;

const getBotLocation = async (req, res) => {
  try {
    // console.log("Fetching from ThingSpeak:", THINGSPEAK_URL); 

    const response = await axios.get(THINGSPEAK_URL);

    // console.log("ThingSpeak API Response:", response.data);


    if (!response.data.feeds || response.data.feeds.length === 0) {
      console.error("No data available from ThingSpeak");
      return res.status(404).json({ message: "No data available from ThingSpeak" });
    }

    const latestFeed = response.data.feeds[0];

    // Ensure field1 and field2 exist and are not empty
    if (!latestFeed.field1 || !latestFeed.field2) {
      console.error("ThingSpeak data fields are missing:", latestFeed);
      return res.status(400).json({ message: "ThingSpeak data fields missing" });
    }

    // Convert coordinates to numbers
    const botLocation = {
      x: parseFloat(latestFeed.field1),
      y: parseFloat(latestFeed.field2),
      timestamp: latestFeed.created_at,
    };

    // console.log("Parsed Bot Location:", botLocation); 

    res.json(botLocation);
  } catch (error) {
    console.error("Error fetching bot data:", error.message);
    res.status(500).json({ message: "Server error fetching bot location" });
  }
};

module.exports = { getBotLocation };
