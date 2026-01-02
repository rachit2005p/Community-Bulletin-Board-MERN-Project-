require('dotenv').config();
const { User } = require('../models/mongo');
const connectMongoDB = require('../config/mongo');


const seedData = async () => {
  try {
    console.log('🌱 Seeding MongoDB database...');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (!existingAdmin) {
      // Create default admin user
      const adminUser = new User({
        username: 'admin',
        email: 'admin@community.com',
        password: 'admin123', // This will be hashed by the pre-save middleware
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        isActive: true,
        emailVerified: true,
      });

      await adminUser.save();
      console.log('✅ Created default admin user: admin / admin123');
      console.log('   Email: admin@community.com');
    } else {
      console.log('⏭️  Admin user already exists');
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
const runSeeder = async () => {
  try {
    await connectMongoDB();
    await seedData();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runSeeder();
}

module.exports = { seedData };
