const express = require('express');
const { protect } = require('../middleware/auth');
const { mockData } = require('../data/mockData');

const router = express.Router();

router.use(protect);

// 1. Dashboard summary
router.get('/dashboard', (req, res) => {
  const summary = {
    totalBookings: mockData.bookings.length,
    pendingBookings: mockData.bookings.filter((b) => b.status === 'Pending').length,
    assignedBookings: mockData.bookings.filter((b) => b.status === 'Assigned').length,
    inProgressBookings: mockData.bookings.filter((b) => b.status === 'In Progress').length,
    completedJobs: mockData.bookings.filter((b) => b.status === 'Completed').length,
    activeTechnicians: mockData.technicians.filter((t) => t.status !== 'Off Duty').length,
    monthlyRevenue: mockData.bookings.reduce((acc, b) => {
      if (b.status === 'Completed') {
        return acc + (b.serviceType === 'RO Installation' ? 1499 : b.serviceType === 'RO Repair' ? 799 : 499);
      }
      return acc;
    }, 0) || 2796
  };

  res.json({
    summary,
    bookings: mockData.bookings,
    technicians: mockData.technicians,
    customers: mockData.customers,
    pricing: mockData.pricing,
    reviews: mockData.reviews
  });
});

// 2. Bookings CRUD & Status
router.get('/bookings', (req, res) => {
  res.json({ bookings: mockData.bookings });
});

router.patch('/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = mockData.bookings.find((b) => b.id === id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  res.json({ message: 'Booking status updated', booking });
});

// 3. Assign Technician to Booking
router.patch('/bookings/:id/assign', (req, res) => {
  const { id } = req.params;
  const { technicianId } = req.body;

  const booking = mockData.bookings.find((b) => b.id === id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  const tech = mockData.technicians.find((t) => t.id === technicianId);
  if (!tech) {
    return res.status(404).json({ message: 'Technician not found' });
  }

  booking.assignedTechnician = {
    id: tech.id,
    name: tech.name,
    phone: tech.phone,
    specialty: tech.specialty,
    assignedAt: new Date().toISOString()
  };
  booking.status = 'Assigned';

  // Mark technician as On Duty
  tech.status = 'On Duty';

  res.json({
    message: `Assigned ${tech.name} to booking ${id}`,
    booking,
    technician: tech
  });
});

// 4. WhatsApp Updates Generator & Dispatcher
router.post('/bookings/:id/whatsapp', (req, res) => {
  const { id } = req.params;
  const { type = 'technician_assigned', customMessage = '' } = req.body;

  const booking = mockData.bookings.find((b) => b.id === id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  let text = '';
  let recipientPhone = (booking.phone || '').replace(/\D/g, '');
  if (recipientPhone.length === 10) recipientPhone = '91' + recipientPhone;

  const tech = booking.assignedTechnician || { name: 'Assigned Technician', phone: '+91 75378 72629' };

  switch (type) {
    case 'booking_confirmed':
      text = `*Water Filter Care - Booking Confirmed*\n\nDear ${booking.customerName},\nYour service request (${booking.serviceType}) has been confirmed!\n\n📍 Address: ${booking.address || 'Bhubaneswar'}\n💰 Inspection Fee: Just ₹199/-\n\nA certified technician is being scheduled for your doorstep visit. Helpline: +91 75378 72629.`;
      break;

    case 'technician_assigned':
      text = `*Water Filter Care - Technician On The Way!*\n\nDear ${booking.customerName},\nOur technician *${tech.name}* (${tech.phone}) has been assigned to your service request for ${booking.serviceType}.\n\nEstimated Arrival: Today within 45-60 mins.\nTechnician Contact: ${tech.phone}\nHelpline: +91 75378 72629.`;
      break;

    case 'job_completed':
      text = `*Water Filter Care - Service Completed*\n\nDear ${booking.customerName},\nThank you for choosing Water Filter Care! Your RO service (${booking.serviceType}) has been completed.\n\n🛡️ 30-Day Service Guarantee Activated.\nTDS Check Verified.\nHelpline: +91 75378 72629.`;
      break;

    case 'notify_technician':
      const techPhone = (tech.phone || '').replace(/\D/g, '');
      recipientPhone = techPhone.length === 10 ? '91' + techPhone : techPhone;
      text = `*Water Filter Care - New Job Assigned*\n\nHi ${tech.name},\nYou have a new doorstep service job:\n\n👤 Customer: ${booking.customerName}\n📞 Phone: ${booking.phone}\n🛠️ Service: ${booking.serviceType}\n📍 Address: ${booking.address}\n\nPlease reach out to customer immediately.`;
      break;

    default:
      text = customMessage || `*Water Filter Care Update*\n\nDear ${booking.customerName}, regarding your booking ${booking.id}: ${booking.serviceType}. Helpline: +91 75378 72629.`;
  }

  const waLink = `https://wa.me/${recipientPhone}?text=${encodeURIComponent(text)}`;

  if (!booking.whatsappLogs) booking.whatsappLogs = [];
  const logEntry = {
    id: `WA-${Date.now()}`,
    type,
    recipient: recipientPhone,
    text,
    waLink,
    sentAt: new Date().toISOString()
  };
  booking.whatsappLogs.unshift(logEntry);

  res.json({
    message: 'WhatsApp update prepared',
    logEntry,
    waLink,
    text
  });
});

// 5. Technician Team Control Endpoints
router.get('/technicians', (req, res) => {
  res.json({ technicians: mockData.technicians });
});

router.post('/technicians', (req, res) => {
  const { name, phone, city = 'Bhubaneswar', specialty = 'RO Repair', status = 'Available' } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and Phone are required' });
  }

  const newTech = {
    id: `TECH-0${mockData.technicians.length + 1}`,
    name,
    phone,
    city,
    specialty,
    status,
    completedJobs: 0,
    rating: 5.0,
    createdAt: new Date().toISOString()
  };

  mockData.technicians.push(newTech);
  res.status(201).json({ message: 'Technician added successfully', technician: newTech });
});

router.patch('/technicians/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const tech = mockData.technicians.find((t) => t.id === id);
  if (!tech) {
    return res.status(404).json({ message: 'Technician not found' });
  }

  tech.status = status;
  res.json({ message: 'Technician status updated', technician: tech });
});

router.delete('/technicians/:id', (req, res) => {
  const { id } = req.params;
  const index = mockData.technicians.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Technician not found' });
  }

  const removed = mockData.technicians.splice(index, 1);
  res.json({ message: 'Technician removed from team roster', technician: removed[0] });
});

// 6. Pricing Control
router.get('/pricing', (req, res) => {
  res.json({ pricing: mockData.pricing });
});

router.put('/pricing', (req, res) => {
  const { startingCharge, installation, repair, maintenance, amc, filterReplacement } = req.body;

  mockData.pricing = {
    startingCharge: Number(startingCharge ?? mockData.pricing.startingCharge),
    installation: Number(installation ?? mockData.pricing.installation),
    repair: Number(repair ?? mockData.pricing.repair),
    maintenance: Number(maintenance ?? mockData.pricing.maintenance),
    amc: Number(amc ?? mockData.pricing.amc),
    filterReplacement: Number(filterReplacement ?? mockData.pricing.filterReplacement)
  };

  res.json({ message: 'Pricing updated successfully', pricing: mockData.pricing });
});

// 7. Customers & Reviews
router.get('/customers', (req, res) => {
  res.json({ customers: mockData.customers });
});

router.get('/reviews', (req, res) => {
  res.json({ reviews: mockData.reviews });
});

module.exports = router;
