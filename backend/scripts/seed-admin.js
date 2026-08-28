import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@buynestventures.shop';
    const adminPassword = 'Admin@buynest123';
    const adminName = 'BuyNest Master Admin';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    let user = await User.findOne({ email: adminEmail });

    if (user) {
      user.name = adminName;
      user.passwordHash = passwordHash;
      user.isAdmin = true;
      user.provider = 'local';
      await user.save();
      console.log('Existing admin updated successfully!');
    } else {
      user = await User.create({
        name: adminName,
        email: adminEmail,
        passwordHash,
        isAdmin: true,
        provider: 'local',
      });
      console.log('New admin created successfully!');
    }

    console.log('-------------------------------------------');
    console.log('Admin Account Seeded:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('isAdmin:', user.isAdmin);
    console.log('-------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
}

seedAdmin();
