import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db";
import { User } from "./models/User";
import { Vehicle } from "./models/Vehicle";
import { Driver } from "./models/Driver";

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

    const hashedPassword = await bcrypt.hash("password123", 10);

    await User.create([
      { name: "Admin User", email: "admin@transitops.com", password: hashedPassword, role: "Admin" },
      { name: "Fleet Manager", email: "manager@transitops.com", password: hashedPassword, role: "Fleet Manager" },
      { name: "Safety Officer", email: "safety@transitops.com", password: hashedPassword, role: "Safety Officer" },
      { name: "Financial Analyst", email: "finance@transitops.com", password: hashedPassword, role: "Financial Analyst" },
    ]);

    await Vehicle.create([
      { regNo: "TRK-001", modelName: "Volvo FH16", type: "Heavy Truck", capacity: 5000, odometer: 150000, acquisitionCost: 120000, status: "Available", region: "North" },
      { regNo: "TRK-002", modelName: "Scania R500", type: "Heavy Truck", capacity: 8000, odometer: 210000, acquisitionCost: 140000, status: "In Shop", region: "South" },
      { regNo: "TRK-003", modelName: "Mercedes Sprinter", type: "Van", capacity: 3000, odometer: 50000, acquisitionCost: 50000, status: "Available", region: "East" }
    ]);

    await Driver.create([
      { name: "John Doe", licenseNumber: "DL-12345", licenseCategory: "C1", licenseExpiryDate: new Date("2027-01-01"), contactNumber: "+1234567890", safetyScore: 95, status: "Available" },
      { name: "Jane Smith", licenseNumber: "DL-67890", licenseCategory: "B", licenseExpiryDate: new Date("2026-05-15"), contactNumber: "+0987654321", safetyScore: 88, status: "Off Duty" },
      { name: "Mike Johnson", licenseNumber: "DL-54321", licenseCategory: "CE", licenseExpiryDate: new Date("2025-11-30"), contactNumber: "+1122334455", safetyScore: 99, status: "Available" }
    ]);

    console.log("Data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};
seedData();
