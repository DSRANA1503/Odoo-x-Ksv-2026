//@ts-nocheck
import { Request, Response } from "express";
import { Trip } from "../models/Trip";
import { Vehicle } from "../models/Vehicle";
import { Driver } from "../models/Driver";

export const getTrips = async (req: Request, res: Response) => {
  try {
    const trips = await Trip.find().populate("vehicleId driverId").sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createTrip = async (req: Request, res: Response) => {
  try {
    const { vehicleId, driverId, cargoWeight, origin, destination } = req.body;
    
    if (origin && destination && origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
      return res.status(400).json({ message: "Origin and destination cannot be the same" });
    }
    
    const vehicle = await Vehicle.findOne({ _id: vehicleId });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    
    if (vehicle.status === "Retired" || vehicle.status === "In Shop") {
      return res.status(400).json({ message: "Vehicle cannot be used for trips" });
    }
    
    if (vehicle.status === "On Trip") {
      return res.status(400).json({ message: "Vehicle is already on a trip" });
    }
    
    if (cargoWeight > vehicle.capacity) {
      return res.status(400).json({ message: "Cargo weight exceeds vehicle capacity" });
    }

    const driver = await Driver.findOne({ _id: driverId });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    
    if (driver.status === "Suspended") {
      return res.status(400).json({ message: "Driver is suspended" });
    }
    
    if (new Date(driver.licenseExpiryDate) < new Date()) {
      return res.status(400).json({ message: "Driver license is expired" });
    }
    
    if (driver.status === "On Trip") {
      return res.status(400).json({ message: "Driver is already on a trip" });
    }

    const trip = new Trip({ ...req.body, lifecycleState: "Draft" });
    await trip.save();
    res.status(201).json(trip);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const dispatchTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findOne({ _id: id });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    
    if (trip.lifecycleState !== "Draft") {
      return res.status(400).json({ message: "Only Draft trips can be dispatched" });
    }

    const vehicle = await Vehicle.findOne({ _id: trip.vehicleId });
    const driver = await Driver.findOne({ _id: trip.driverId });
    
    if (!vehicle || vehicle.status !== "Available" || !driver || driver.status !== "Available") {
      return res.status(400).json({ message: "Vehicle or Driver is not available" });
    }
    
    if (new Date(driver.licenseExpiryDate) < new Date()) {
      return res.status(400).json({ message: "Driver license is expired" });
    }
    
    trip.lifecycleState = "Dispatched";
    await trip.save();
    
    await Vehicle.updateOne({ _id: trip.vehicleId }, { status: "On Trip" });
    await Driver.updateOne({ _id: trip.driverId }, { status: "On Trip" });
    
    res.json(trip);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const completeTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { actualDistance, fuelConsumed, revenue } = req.body;
    
    const trip = await Trip.findOne({ _id: id });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    
    if (trip.lifecycleState !== "Dispatched") {
      return res.status(400).json({ message: "Only Dispatched trips can be completed" });
    }

    trip.lifecycleState = "Completed";
    if (actualDistance !== undefined) trip.actualDistance = actualDistance;
    if (fuelConsumed !== undefined) trip.fuelConsumed = fuelConsumed;
    if (revenue !== undefined) trip.revenue = revenue;
    
    await trip.save();
    
    await Vehicle.updateOne(
      { _id: trip.vehicleId }, 
      { 
        status: "Available",
        $inc: { odometer: actualDistance || trip.plannedDistance }
      }
    );
    await Driver.updateOne({ _id: trip.driverId }, { status: "Available" });
    
    res.json(trip);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findOne({ _id: id });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    
    if (trip.lifecycleState === "Completed" || trip.lifecycleState === "Cancelled") {
      return res.status(400).json({ message: "Trip is already completed or cancelled" });
    }

    const wasDispatched = trip.lifecycleState === "Dispatched";
    
    trip.lifecycleState = "Cancelled";
    await trip.save();
    
    if (wasDispatched) {
      await Vehicle.updateOne({ _id: trip.vehicleId }, { status: "Available" });
      await Driver.updateOne({ _id: trip.driverId }, { status: "Available" });
    }
    
    res.json(trip);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
