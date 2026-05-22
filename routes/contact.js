const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ContactMessage = require('../models/ContactMessage');

router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      global.inMemoryMessages = global.inMemoryMessages || [];
      const message = {
        ...req.body,
        _id: 'msg_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      global.inMemoryMessages.push(message);
      console.log('[In-Memory DB] Stored contact message:', message);
      return res.status(201).json({ message: 'Message received (In-Memory Fallback)', message });
    }

    const message = new ContactMessage(req.body);
    await message.save();
    res.status(201).json({ message: 'Message received', message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
