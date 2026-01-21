require('dotenv').config();
const app = require('./src/app');
const seedData = require('./src/utils/seedData');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // Database Connection
    await sequelize.authenticate();
    console.log('✅ SBI Database Connected (SQLite)');

    // Sync Models
    // In production, use migrations. For this assignment, sync.
    // Use { force: true } to reset and seed on every restart for development ease?
    // Or check if stations exist.
    // Let's use a flag or just sync.
    const shouldSeed = process.env.SEED_DB === 'true'; // Allow env control

    if (shouldSeed) {
      console.log('🌱 Seeding Database...');
      await seedData();
    } else {
      await sequelize.sync(); // Create tables if not exist
      // Check if we need initial seed anyway
      const count = await require('./src/models/Station').count();
      if (count === 0) {
        console.log('🌱 Empty DB detected. Seeding...');
        await seedData();
      }
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
}

startServer();