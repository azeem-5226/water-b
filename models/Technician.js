const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    specialty: { type: String, required: true },
    status: { type: String, enum: ['Available', 'On Duty', 'Off Duty'], default: 'Available' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Technician', technicianSchema);
