const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Donation = require('../models/Donation');

router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      global.inMemoryDonations = global.inMemoryDonations || [];
      const donation = {
        ...req.body,
        _id: 'don_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      global.inMemoryDonations.push(donation);
      console.log('[In-Memory DB] Stored donation:', donation);
      return res.status(201).json({ message: 'Donation stored (In-Memory Fallback)', donation });
    }

    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json({ message: 'Donation stored', donation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      global.inMemoryDonations = global.inMemoryDonations || [];
      // Return sorted in-memory donations (latest first), limit to 10
      const donations = [...global.inMemoryDonations]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
      return res.json(donations);
    }

    const donations = await Donation.find().sort({ createdAt: -1 }).limit(10);
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
