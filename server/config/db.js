const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not set in your .env file.');
    console.error('👉 Please paste your MongoDB Atlas connection string into server/.env');
    return null;
  }

  // Detect unreplaced password placeholder
  if (uri.includes('<password>') || uri.includes('<db_password>')) {
    console.error('\n⚠️  MongoDB Connection Warning:');
    console.error('Your MONGODB_URI still contains a password placeholder (e.g. <db_password> or <password>).');
    console.error('👉 Open server/.env and replace the placeholder with your actual Atlas database user password.\n');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'expense-tracker', // Ensures data is stored in 'expense-tracker' database even if omitted in URI
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed:');
    console.error(`- Error: ${error.message}`);

    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('👉 Cause: Incorrect database username or password in MONGODB_URI.');
      console.error('   Verify your credentials in Atlas > Database Access.');
    } else if (
      error.message.includes('querySrv') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('timed out')
    ) {
      console.error('👉 Cause: Network whitelist issue or cluster URL is unreachable.');
      console.error('   In MongoDB Atlas, go to "Network Access" -> click "Add IP Address" -> choose "Allow Access from Anywhere" (0.0.0.0/0).\n');
    }

    return null;
  }
};

const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Monitor ongoing connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected.');
});

module.exports = { connectDB, isDbConnected };
