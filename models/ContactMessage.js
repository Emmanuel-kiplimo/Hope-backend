const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  subject: String,
  inquiryType: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
