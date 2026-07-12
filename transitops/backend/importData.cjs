const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/transitops";

async function importData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const seedDir = path.join(__dirname, 'seedData');
    const collections = [
      { name: 'users', model: require('./models/User').User },
      { name: 'vehicles', model: require('./models/Vehicle').Vehicle },
      { name: 'drivers', model: require('./models/Driver').Driver },
      { name: 'trips', model: require('./models/Trip').Trip },
      { name: 'fuellogs', model: require('./models/FuelLog').FuelLog },
      { name: 'expenses', model: require('./models/Expense').Expense },
      { name: 'maintenancelogs', model: require('./models/MaintenanceLog').MaintenanceLog },
    ];

    for (const { name, model } of collections) {
      if (!model) continue;
      const filePath = path.join(seedDir, `${name.replace('fuellogs', 'fuelLogs').replace('maintenancelogs', 'maintenanceLogs')}.json`);
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        // Convert $oid and $date
        const processedData = data.map(item => {
          const processed = { ...item };
          if (processed._id && processed._id.$oid) processed._id = processed._id.$oid;
          if (processed.createdAt && processed.createdAt.$date) processed.createdAt = new Date(processed.createdAt.$date);
          if (processed.updatedAt && processed.updatedAt.$date) processed.updatedAt = new Date(processed.updatedAt.$date);
          if (processed.date && processed.date.$date) processed.date = new Date(processed.date.$date);
          if (processed.licenseExpiryDate && processed.licenseExpiryDate.$date) processed.licenseExpiryDate = new Date(processed.licenseExpiryDate.$date);
          return processed;
        });

        await model.deleteMany({});
        await model.insertMany(processedData);
        console.log(`Imported ${processedData.length} records into ${model.collection.collectionName}`);
      }
    }
    
    console.log('Data import complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();
