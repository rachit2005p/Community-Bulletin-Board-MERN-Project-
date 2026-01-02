const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    // Build MongoDB URI dynamically from environment variables
    const mongoHost = process.env.MONGODB_HOST || 'localhost';
    const mongoPort = process.env.MONGODB_PORT || '27017';
    const mongoDatabase = process.env.MONGODB_DATABASE || 'community-bulletin';
    const mongoUsername = process.env.MONGODB_USERNAME || '';
    const mongoPassword = process.env.MONGODB_PASSWORD || '';

    // Use full URI if provided, otherwise build from components
    let mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      if (mongoUsername && mongoPassword) {
        mongoURI = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;
      } else {
        mongoURI = `mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}`;
      }

      // Add additional options if provided
      const options = [];
      if (process.env.MONGODB_AUTH_SOURCE) options.push(`authSource=${process.env.MONGODB_AUTH_SOURCE}`);
      if (process.env.MONGODB_REPLICA_SET) options.push(`replicaSet=${process.env.MONGODB_REPLICA_SET}`);

      if (options.length > 0) {
        mongoURI += `?${options.join('&')}`;
      }
    }

    console.log(`Connecting to MongoDB: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
