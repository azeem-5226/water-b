const serviceCatalog = [
  {
    id: 'ro-installation',
    name: 'RO Installation',
    price: 1499,
    description: 'Complete purifier setup with testing and quick-start guidance.',
    icon: 'install'
  },
  {
    id: 'ro-repair',
    name: 'RO Repair',
    price: 799,
    description: 'Leak, pressure, or filter issues fixed by trained service experts.',
    icon: 'repair'
  },
  {
    id: 'maintenance',
    name: 'Annual Maintenance',
    price: 1299,
    description: 'Routine inspection, sanitization, and performance tune-up.',
    icon: 'maintenance'
  },
  {
    id: 'amc',
    name: 'AMC Plan',
    price: 2499,
    description: 'Priority support, periodic checks, and discounted repairs.',
    icon: 'amc'
  },
  {
    id: 'filter-change',
    name: 'Filter Replacement',
    price: 999,
    description: 'Genuine filter replacement for cleaner, better tasting water.',
    icon: 'filter'
  }
];

const bookings = [
  {
    id: 'BK-1001',
    customerName: 'Rohit Mehta',
    phone: '+91 98765 43210',
    email: 'rohit@example.com',
    serviceType: 'RO Repair',
    problem: 'Low pressure and leakage near pipe connection',
    address: 'Andheri East, Mumbai',
    preferredDate: '2026-10-15',
    status: 'Pending',
    createdAt: '2026-10-09T10:00:00.000Z'
  },
  {
    id: 'BK-1002',
    customerName: 'Sneha Sharma',
    phone: '+91 91234 56780',
    email: 'sneha@example.com',
    serviceType: 'Filter Replacement',
    problem: 'Need replacement of carbon and RO membrane filters',
    address: 'Banjara Hills, Hyderabad',
    preferredDate: '2026-10-18',
    status: 'Assigned',
    createdAt: '2026-10-10T12:30:00.000Z'
  },
  {
    id: 'BK-1003',
    customerName: 'Aman Verma',
    phone: '+91 70000 11122',
    email: 'aman@example.com',
    serviceType: 'RO Installation',
    problem: 'Installation for new apartment kitchen purifier',
    address: 'Sector 62, Noida',
    preferredDate: '2026-10-20',
    status: 'Completed',
    createdAt: '2026-10-08T09:15:00.000Z'
  }
];

const technicians = [
  { id: 'TECH-01', name: 'Rajesh Mohanty', phone: '+91 75378 72629', city: 'Bhubaneswar', specialty: 'RO Repair & Pump Expert', status: 'Available', completedJobs: 48, rating: 4.9 },
  { id: 'TECH-02', name: 'Deepak Pradhan', phone: '+91 94371 88290', city: 'Cuttack', specialty: 'Installation & Piping', status: 'On Duty', completedJobs: 35, rating: 4.8 },
  { id: 'TECH-03', name: 'Bikash Sahoo', phone: '+91 98612 44551', city: 'Jatni', specialty: 'Membrane & Filter Master', status: 'Available', completedJobs: 42, rating: 4.9 },
  { id: 'TECH-04', name: 'Manoj Kumar Rout', phone: '+91 97765 33211', city: 'Bhubaneswar', specialty: 'Deep Sanitization & AMC', status: 'Available', completedJobs: 29, rating: 4.7 }
];

const customers = [
  { id: 'CUST-01', name: 'Rohit Mehta', phone: '+91 98765 43210', city: 'Mumbai', service: 'RO Repair', joinedAt: '2026-09-15' },
  { id: 'CUST-02', name: 'Sneha Sharma', phone: '+91 91234 56780', city: 'Hyderabad', service: 'Filter Replacement', joinedAt: '2026-09-22' },
  { id: 'CUST-03', name: 'Aman Verma', phone: '+91 70000 11122', city: 'Noida', service: 'RO Installation', joinedAt: '2026-08-04' }
];

const reviews = [
  {
    id: 'REV-01',
    name: 'Priya Kulkarni',
    rating: 5,
    service: 'RO Repair',
    message: 'Very prompt service and the technician explained the issue clearly. The purifier is working perfectly now.'
  },
  {
    id: 'REV-02',
    name: 'Neeraj Gupta',
    rating: 5,
    service: 'AMC Plan',
    message: 'The annual maintenance plan is very useful. Quick response and professional support every time.'
  },
  {
    id: 'REV-03',
    name: 'Sonal Joshi',
    rating: 4,
    service: 'Filter Replacement',
    message: 'Filter replacement was done on time and water quality improved immediately.'
  }
];

const pricing = {
  startingCharge: 199,
  installation: 1499,
  repair: 799,
  maintenance: 1299,
  amc: 2499,
  filterReplacement: 999
};

const dashboardSummary = {
  totalBookings: bookings.length,
  pendingBookings: bookings.filter((booking) => booking.status === 'Pending').length,
  completedJobs: bookings.filter((booking) => booking.status === 'Completed').length,
  activeTechnicians: technicians.length
};

const mockData = {
  services: serviceCatalog,
  bookings,
  technicians,
  customers,
  reviews,
  pricing,
  dashboardSummary
};

module.exports = { mockData };
