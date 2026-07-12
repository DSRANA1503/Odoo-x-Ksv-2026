//@ts-nocheck
import { Request, Response } from "express";
import { Driver } from "../models/Driver";

export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const createDriver = async (req: Request, res: Response) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "License number must be unique" });
    }
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const updateDriver = async (req: Request, res: Response) => {
  try {
    const driver = await Driver.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json(driver);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error });
  }
};

export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const driver = await Driver.findOneAndDelete({ _id: req.params.id });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.json({ message: "Driver deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

import { ReminderLog } from "../models/ReminderLog";
import { sendLicenseExpiryReminder } from "../utils/emailService";

export const triggerReminders = async (req: Request, res: Response) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringDrivers = await Driver.find({
      licenseExpiryDate: {
        $gt: new Date(),
        $lte: thirtyDaysFromNow
      },
      status: { $ne: "Retired" }
    } as any);

    let count = 0;
    for (const driver of expiringDrivers) {
      const email = driver.name.toLowerCase().replace(/\s+/g, '.') + "@transitops.mock";
      const success = await sendLicenseExpiryReminder(email, driver.name, new Date(driver.licenseExpiryDate));
      if (success) {
        await ReminderLog.create({
          driverId: driver._id,
          type: "License Expiry"
        });
        count++;
      }
    }
    res.json({ message: `Sent ${count} reminder(s)` });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
