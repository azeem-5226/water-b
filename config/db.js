const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ro_service_db';

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed. Running in fallback mode:', error.message);
    return false;
  }
};

module.exports = { connectDB };
