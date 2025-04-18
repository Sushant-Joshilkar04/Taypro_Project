const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const botRoutes = require('./routes/botRoutes');
const cleaningStatsRoutes = require('./routes/CleaningStats');
const cleaningRoutes = require('./routes/cleaningRoutes');
const layoutRoutes = require('./routes/layoutRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bodyParser = require('body-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const cleaningStats = require('./models/CleaningStats'); 

dotenv.config();
require('./config/passport');

const app = express();

connectDB();

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/cleaning-stats', cleaningStatsRoutes);

app.use('/api/layouts', layoutRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => {
  res.send('This is Taypro Server');
});

const THINGSPEAK_CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID;
const THINGSPEAK_API_KEY = process.env.THINGSPEAK_API_KEY;
const THINGSPEAK_URL = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=1`;

// Removed all WebSocket event handlers and connection logic

// Start the server without WebSocket support
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

