//@ts-nocheck
import { Request, Response } from "express";
import { Vehicle } from "../models/Vehicle";

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Registration number must be unique" });
    }
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Vehicle deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

import { Document } from "../models/Document";

export const getVehicleDocuments = async (req: Request, res: Response) => {
  try {
    const docs = await Document.find({ vehicleId: req.params.id }).sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const uploadVehicleDocument = async (req: Request, res: Response) => {
  try {
    const { docType, expiryDate } = req.body;
    let fileUrl = "";
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl; // Fallback if url is provided directly
    } else {
      return res.status(400).json({ message: "File is required" });
    }

    const doc = new Document({
      vehicleId: req.params.id,
      docType,
      fileUrl,
      expiryDate
    });
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};
