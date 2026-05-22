const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Volunteer = require('../models/Volunteer');

router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      global.inMemoryVolunteers = global.inMemoryVolunteers || [];
      const volunteer = {
        ...req.body,
        _id: 'vol_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      global.inMemoryVolunteers.push(volunteer);
      console.log('[In-Memory DB] Stored volunteer application:', volunteer);
      return res.status(201).json({ message: 'Volunteer application received (In-Memory Fallback)', volunteer });
    }

    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.status(201).json({ message: 'Volunteer application received', volunteer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
