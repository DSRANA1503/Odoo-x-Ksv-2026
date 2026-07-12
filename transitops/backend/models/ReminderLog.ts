import mongoose from "mongoose";

const reminderLogSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  type: {
    type: String,
    enum: ["License Expiry", "Other"],
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export const ReminderLog = mongoose.model("ReminderLog", reminderLogSchema);
