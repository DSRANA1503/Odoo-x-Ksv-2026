import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Vehicle } from './models/Vehicle';
import { Driver } from './models/Driver';
import { Trip } from './models/Trip';
import { FuelLog } from './models/FuelLog';
import { Expense } from './models/Expense';
import { MaintenanceLog } from './models/MaintenanceLog';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/transitops";

async function importData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const seedDir = path.join(process.cwd(), 'seedData');
    const collections = [
      { name: 'users', model: User },
      { name: 'vehicles', model: Vehicle },
      { name: 'drivers', model: Driver },
      { name: 'trips', model: Trip },
      { name: 'fuelLogs', model: FuelLog },
      { name: 'expenses', model: Expense },
      { name: 'maintenanceLogs', model: MaintenanceLog },
    ];

    for (const { name, model } of collections) {
      if (!model) continue;
      const filePath = path.join(seedDir, `${name}.json`);
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        // Convert $oid and $date
        const processedData = data.map((item: any) => {
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
