import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  docType: {
    type: String,
    enum: ["Registration", "Insurance", "Permit", "PUC", "Other"],
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export const Document = mongoose.model("Document", documentSchema);
