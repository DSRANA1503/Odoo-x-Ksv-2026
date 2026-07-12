import mongoose from "mongoose";

const maintenanceLogSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  cost: { type: Number, required: true },
  status: { type: String, enum: ["In Progress", "Completed"], default: "In Progress" }
}, { timestamps: true });

export const MaintenanceLog = mongoose.models.MaintenanceLog || mongoose.model("MaintenanceLog", maintenanceLogSchema);
