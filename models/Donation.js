const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  type: String, // One-time or Monthly
  amount: Number,
  paymentMethod: String,
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);
