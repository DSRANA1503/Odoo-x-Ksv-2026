import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  modelName: { type: String, required: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true }, // Maximum Load Capacity
  odometer: { type: Number, required: true },
  acquisitionCost: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["Available", "On Trip", "In Shop", "Retired"],
    default: "Available"
  },
  region: { type: String, required: true }
}, { timestamps: true });

// Prevent model overwrite in hot-reloads
export const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
