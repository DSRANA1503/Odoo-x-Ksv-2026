import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  type: { type: String, enum: ["Toll", "Maintenance", "Misc"], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
