const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const contactRoutes = require('./routes/contact');
const donationRoutes = require('./routes/donations');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/contact', contactRoutes);
app.use('/api/donations', donationRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Could not connect to MongoDB. Exiting...', err);
    process.exit(1);
  }
};

startServer();
