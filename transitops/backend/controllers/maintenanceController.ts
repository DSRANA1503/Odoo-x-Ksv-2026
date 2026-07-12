//@ts-nocheck
import { Request, Response } from "express";
import { MaintenanceLog } from "../models/MaintenanceLog";
import { Vehicle } from "../models/Vehicle";

export const getMaintenanceLogs = async (req: Request, res: Response) => {
  try {
    const logs = await MaintenanceLog.find().populate("vehicleId").sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const logMaintenance = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.body;
    const vehicle = await Vehicle.findOne({ _id: vehicleId });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    if (vehicle.status === "On Trip") {
      return res.status(400).json({ message: "Cannot maintain a vehicle currently on a trip" });
    }

    const log = new MaintenanceLog(req.body);
    await log.save();
    
    if (vehicle.status !== "Retired") {
      await Vehicle.updateOne({ _id: vehicleId }, { status: "In Shop" });
    }
    
    res.status(201).json(log);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const completeMaintenance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const log = await MaintenanceLog.findOne({ _id: id });
    if (!log) return res.status(404).json({ message: "Log not found" });

    if (log.status === "Completed") {
      return res.status(400).json({ message: "Maintenance is already completed" });
    }

    log.status = "Completed";
    await log.save();

    const vehicle = await Vehicle.findOne({ _id: log.vehicleId });
    if (vehicle && vehicle.status !== "Retired") {
      vehicle.status = "Available";
      await vehicle.save();
    }
    
    res.json(log);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
