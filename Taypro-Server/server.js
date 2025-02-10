//server.js
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
require('./config/passport');

const app = express();


connectDB();

//middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

//routes
app.use('/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('\nThis is Taypro Server');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
