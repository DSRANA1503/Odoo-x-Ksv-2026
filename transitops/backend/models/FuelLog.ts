import mongoose from "mongoose";

const fuelLogSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  liters: { type: Number, required: true },
  cost: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export const FuelLog = mongoose.models.FuelLog || mongoose.model("FuelLog", fuelLogSchema);
