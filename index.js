const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS options to allow your specific frontend origin and credentials
const corsOptions = {
  origin: process.env.CORS_ORIGIN, // This should be your frontend's URL, e.g., 'http://localhost:3001'
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify the HTTP methods your frontend will use
  credentials: true, // This is crucial if your frontend sends cookies or auth headers
};

// Use CORS middleware with the configured options
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

const contactRoutes = require('./routes/contact');
const donationRoutes = require('./routes/donations');

app.use('/api/contact', contactRoutes);
app.use('/api/donations', donationRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const PORT = process.env.PORT || 3000; // Use PORT from .env or default to 3000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Could not connect to MongoDB. Exiting...', err);
    process.exit(1);
  }
};

startServer();
