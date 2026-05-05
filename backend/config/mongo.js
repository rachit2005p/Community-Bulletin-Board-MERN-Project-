const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    // Priority 1: Use full MongoDB URI if provided (best for MongoDB Atlas)
    let mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      // Priority 2: Build URI from components
      const mongoHost = process.env.MONGODB_HOST || 'localhost';
      const mongoPort = process.env.MONGODB_PORT || '27017';
      const mongoDatabase = process.env.MONGODB_DATABASE || 'community-bulletin';
      const mongoUsername = process.env.MONGODB_USER || process.env.MONGODB_USERNAME || '';
      const mongoPassword = process.env.MONGODB_PASSWORD || '';

      if (mongoUsername && mongoPassword) {
        // Check if it's MongoDB Atlas (contains mongodb+srv)
        if (mongoHost.includes('mongodb.net')) {
          // MongoDB Atlas format
          mongoURI = `mongodb+srv://${mongoUsername}:${encodeURIComponent(mongoPassword)}@${mongoHost}/${mongoDatabase}?retryWrites=true&w=majority`;
        } else {
          // Standard MongoDB format
          mongoURI = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;
        }
      } else {
        // No authentication
        mongoURI = `mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}`;
      }

      // Add additional options if provided
      const options = [];
      if (process.env.MONGODB_AUTH_SOURCE && !mongoHost.includes('mongodb.net')) {
        options.push(`authSource=${process.env.MONGODB_AUTH_SOURCE}`);
      }
      if (process.env.MONGODB_REPLICA_SET) {
        options.push(`replicaSet=${process.env.MONGODB_REPLICA_SET}`);
      }

      if (options.length > 0 && !mongoHost.includes('mongodb.net')) {
        mongoURI += `${mongoURI.includes('?') ? '&' : '?'}${options.join('&')}`;
      }
    }

    console.log(`Connecting to MongoDB: ${mongoURI.replace(/\/\/.*:.*@/, '//***:***@')}`); // Hide credentials in logs

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
