const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const botRoutes = require('./routes/botRoutes');
const cleaningStatsRoutes = require('./routes/CleaningStats');
const cleaningRoutes = require('./routes/cleaningRoutes');
const layoutRoutes = require('./routes/layoutRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const http = require('http'); 
const { Server } = require('socket.io'); // Correctly importing Server from socket.io
const bodyParser = require('body-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const cleaningStats = require('./models/CleaningStats'); 

dotenv.config();
require('./config/passport');

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Ensure this matches your frontend URL
    methods: ["GET", "POST"]
  }
});

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

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  const fetchCleaningStats = async () => {
    try {
      const stats = await cleaningStats.find().sort({ timestamp: -1 }).limit(5); 
      io.emit("updateCleaningStats", stats); 
    } catch (error) {
      console.error("Error fetching cleaning stats:", error.message);
    }
  };

  
  const intervalId = setInterval(fetchCleaningStats, 5000);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    clearInterval(intervalId);
  });
});

// Start the server with WebSocket support
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

