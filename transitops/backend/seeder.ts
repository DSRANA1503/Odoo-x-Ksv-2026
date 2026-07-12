import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db";
import { User } from "./models/User";
import { Vehicle } from "./models/Vehicle";
import { Driver } from "./models/Driver";
import { Trip } from "./models/Trip";
import { MaintenanceLog } from "./models/MaintenanceLog";
import { FuelLog } from "./models/FuelLog";
import { Expense } from "./models/Expense";

const seedData = async () => {
  try {
    await connectDB();
    if (!process.env.MONGO_URI) {
      console.log("No MONGO_URI, skip seeding");
      return;
    }
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Driver.deleteMany();
    await Trip.deleteMany();
    await MaintenanceLog.deleteMany();
    await FuelLog.deleteMany();
    await Expense.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);
    
    // USERS
    const users = await User.create([
      { name: "Admin Super", email: "admin@transitops.com", password: hashedPassword, role: "Admin" },
      { name: "John Manager", email: "manager@transitops.com", password: hashedPassword, role: "Fleet Manager" },
      { name: "Sarah Safety", email: "safety@transitops.com", password: hashedPassword, role: "Safety Officer" },
      { name: "Frank Finance", email: "finance@transitops.com", password: hashedPassword, role: "Financial Analyst" },
      { name: "Dave Driver", email: "driver@transitops.com", password: hashedPassword, role: "Driver" }
    ]);

    const regions = ["North America", "Europe", "Asia", "South America"];
    const vTypes = ["Heavy Truck", "Medium Truck", "Light Van"];
    const statuses = ["Available", "On Trip", "In Shop", "Retired"];
    
    // VEHICLES
    const vehicles = [];
    for(let i=1; i<=20; i++) {
      vehicles.push({
        regNo: `TRK-00${i}`,
        modelName: ["Volvo FH16", "Scania R500", "Mercedes Sprinter", "Ford Transit", "MAN TGX"][i%5],
        type: vTypes[i%3],
        capacity: 1000 + (i*500),
        odometer: 10000 + (i*15000),
        acquisitionCost: 40000 + (i*5000),
        status: statuses[i%4],
        region: regions[i%4]
      });
    }
    const insertedVehicles = await Vehicle.create(vehicles);

    // DRIVERS
    const driverStatuses = ["Available", "On Trip", "Off Duty", "Suspended"];
    const drivers = [];
    for(let i=1; i<=15; i++) {
      drivers.push({
        name: `Driver ${["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"][i%8]}`,
        licenseNumber: `DL-100${i}`,
        licenseCategory: ["C1", "B", "CE"][i%3],
        licenseExpiryDate: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000),
        contactNumber: `+123456789${i < 10 ? '0' + i : i}`,
        safetyScore: 60 + (i*2),
        status: driverStatuses[i%4]
      });
    }
    const insertedDrivers = await Driver.create(drivers);

    // TRIPS
    const tripStatuses = ["Draft", "Dispatched", "Completed", "Cancelled"];
    const trips = [];
    for(let i=1; i<=30; i++) {
      trips.push({
        vehicleId: insertedVehicles[i%20]._id,
        driverId: insertedDrivers[i%15]._id,
        origin: ["New York", "London", "Tokyo", "Berlin", "Paris", "Sydney", "Dubai"][i%7],
        destination: ["Boston", "Manchester", "Osaka", "Munich", "Lyon", "Melbourne", "Abu Dhabi"][i%7],
        cargoWeight: 500 + i*100,
        plannedDistance: 100 + i*50,
        lifecycleState: tripStatuses[i%4],
        dispatchDate: new Date(Date.now() - (30-i) * 24 * 60 * 60 * 1000)
      });
    }
    await Trip.create(trips);

    // MAINTENANCE
    const mStatuses = ["In Progress", "Completed"];
    const logs = [];
    for(let i=1; i<=15; i++) {
      logs.push({
        vehicleId: insertedVehicles[i%20]._id,
        description: ["Oil Change", "Brake Replacement", "Engine Tuning", "Tire Rotation"][i%4],
        date: new Date(Date.now() - (i*5) * 24 * 60 * 60 * 1000),
        cost: 200 + i*50,
        status: mStatuses[i%2]
      });
    }
    await MaintenanceLog.create(logs);

    // FUEL & EXPENSES
    const fuels = [];
    const exps = [];
    for(let i=1; i<=20; i++) {
      fuels.push({
        vehicleId: insertedVehicles[i%20]._id,
        liters: 50 + i*5,
        cost: 100 + i*10,
        date: new Date(Date.now() - (i*2) * 24 * 60 * 60 * 1000),
      });
      exps.push({
        vehicleId: insertedVehicles[i%20]._id,
        type: ["Toll", "Maintenance", "Misc", "Toll"][i%4],
        amount: 20 + i*5,
        date: new Date(Date.now() - (i*3) * 24 * 60 * 60 * 1000),
        description: `Routine expense ${i}`
      });
    }
    await FuelLog.create(fuels);
    await Expense.create(exps);

    console.log("Database seeded successfully with rich demo data!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
