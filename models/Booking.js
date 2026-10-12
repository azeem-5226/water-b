const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    serviceType: { type: String, required: true },
    problem: { type: String, default: '' },
    address: { type: String, required: true },
    preferredDate: { type: String },
    status: { type: String, enum: ['Pending', 'Assigned', 'In Progress', 'Completed'], default: 'Pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
