const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

router.post('/', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json({ message: 'Donation stored' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
