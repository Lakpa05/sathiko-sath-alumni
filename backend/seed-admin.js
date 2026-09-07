import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './src/models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || 'Admin User';
    if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await Admin.findOneAndUpdate(
      { email },
      { name, email, password: hashedPassword, role: 'superadmin' },
      { new: true, upsert: true, runValidators: true }
    );

    console.log('Admin account is ready');
    console.log(`  Email: ${admin.email}`);
    console.log(`  Name: ${admin.name}`);
    console.log(`  Role: ${admin.role}`);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
