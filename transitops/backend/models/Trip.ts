import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
  lifecycleState: { type: String, enum: ["Draft", "Dispatched", "Completed", "Cancelled"], default: "Draft" },
  cargoWeight: { type: Number, required: true },
  plannedDistance: { type: Number, required: true },
  actualDistance: { type: Number },
  fuelConsumed: { type: Number },
  revenue: { type: Number, default: 0 },
  origin: { type: String, required: true },
  destination: { type: String, required: true }
}, { timestamps: true });

export const Trip = mongoose.models.Trip || mongoose.model("Trip", tripSchema);
