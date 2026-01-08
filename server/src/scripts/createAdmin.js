const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const mongoose = require('mongoose');
const Admin = require('../models/Admin');

console.log('Loaded MONGO_URI:', process.env.MONGO_URI ? 'YES' : 'NO');

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not found. Check .env path.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const email = 'admin@jobsathi.com';

    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log('ℹ️ Admin already exists');
      process.exit(0);
    }

    const admin = new Admin({
      email,
      password: 'Admin@123',
    });

    await admin.save();
    console.log('✅ Admin created successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
