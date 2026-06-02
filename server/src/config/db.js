const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Drop old unique index on payments collection if it exists
    // This is needed because we changed the index from unique to non-unique
    try {
      await conn.connection.db.collection('payments').dropIndex('tenant_1_year_1_month_1');
      console.log('Dropped old unique index on payments');
    } catch (e) {
      // Index might not exist or already dropped — that's fine
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
