const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Room = require('./models/Room');

const seed = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany({});
    await Room.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@umcottage.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890',
    });
    console.log(`Admin created: ${admin.email}`);

    // Create 8 rooms
    const roomsData = [
      { roomNumber: 1, floor: 1, capacity: 1, rentAmount: 1200, amenities: ['WiFi', 'AC', 'Private Bathroom', 'Queen-sized bed', 'Flat-screen TV', 'Mini fridge'], description: 'Comfortable ground floor room with modern amenities.' },
      { roomNumber: 2, floor: 1, capacity: 1, rentAmount: 1200, amenities: ['WiFi', 'AC', 'Private Bathroom', 'Queen-sized bed', 'Flat-screen TV', 'Mini fridge'], description: 'Spacious room with natural lighting and garden view.' },
      { roomNumber: 3, floor: 1, capacity: 1, rentAmount: 1100, amenities: ['WiFi', 'AC', 'Private Bathroom', 'Queen-sized bed', 'Flat-screen TV', 'Mini fridge'], description: 'Cozy room near the entrance with easy access.' },
      { roomNumber: 4, floor: 2, capacity: 1, rentAmount: 1300, amenities: ['WiFi', 'AC', 'Private Bathroom', 'Queen-sized bed', 'Flat-screen TV', 'Mini fridge'], description: 'Upper floor room with balcony and city view.' },
      { roomNumber: 5, floor: 2, capacity: 1, rentAmount: 1300, amenities: ['WiFi', 'AC', 'Private Bathroom', 'Queen-sized bed', 'Flat-screen TV', 'Mini fridge'], description: 'Premium room with extra space and modern furnishings.' },
      { roomNumber: 6, floor: 2, capacity: 1, rentAmount: 1200, amenities: ['WiFi', 'AC', 'Private Bathroom', 'Queen-sized bed', 'Flat-screen TV', 'Mini fridge'], description: 'Quiet room ideal for professionals and students.' },
      { roomNumber: 7, floor: 3, capacity: 1, rentAmount: 1400, amenities: ['WiFi', 'AC', 'Private Bathroom', 'Queen-sized bed', 'Flat-screen TV', 'Mini fridge'], description: 'Top floor room with panoramic views and privacy.' },
      { roomNumber: 8, floor: 3, capacity: 2, rentAmount: 1600, amenities: ['WiFi', 'AC', 'Private Bathroom', 'Queen-sized bed', 'Flat-screen TV', 'Mini fridge'], description: 'Large room with double capacity, perfect for sharing.' },
    ];

    const rooms = await Room.insertMany(roomsData);
    console.log(`${rooms.length} rooms created`);

    console.log('\nSeed completed successfully!');
    console.log('-----------------------------------');
    console.log('Admin login: admin@umcottage.com / admin123');
    console.log('-----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
