const express = require('express');
const { mockData } = require('../data/mockData');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ bookings: mockData.bookings });
});

router.post('/', (req, res) => {
  const bookingData = req.body;

  const booking = {
    id: `BK-${Date.now()}`,
    customerName: bookingData.customerName || 'Guest Customer',
    phone: bookingData.phone || '',
    email: bookingData.email || '',
    serviceType: bookingData.serviceType || 'RO Repair',
    problem: bookingData.problem || 'General service request',
    address: bookingData.address || '',
    preferredDate: bookingData.preferredDate || new Date().toISOString().slice(0, 10),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  mockData.bookings.unshift(booking);
  mockData.dashboardSummary.totalBookings = mockData.bookings.length;
  mockData.dashboardSummary.pendingBookings += 1;

  res.status(201).json({ message: 'Booking created successfully', booking });
});

router.patch('/:id/status', protect, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const bookingIndex = mockData.bookings.findIndex((item) => item.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  mockData.bookings[bookingIndex].status = status;
  res.json({ message: 'Booking updated', booking: mockData.bookings[bookingIndex] });
});

module.exports = router;
