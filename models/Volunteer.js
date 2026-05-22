const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  interests: [String],
  experience: String,
  availability: String,
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', VolunteerSchema);
