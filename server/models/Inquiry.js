const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Converted', 'Closed'],
    default: 'New'
  }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
