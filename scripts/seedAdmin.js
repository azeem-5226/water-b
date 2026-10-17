require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD before running the admin seed');
  }

  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ro_service_db');

  const hashedPassword = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name: 'Administrator',
        email,
        password: hashedPassword,
        role: 'admin'
      }
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin account seeded for ${email}`);
};

seedAdmin()
  .catch((error) => {
    console.error('Admin seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });