import express from "express";
import { Driver } from "../models/Driver";
import { Vehicle } from "../models/Vehicle";
import { Notification } from "../models/Notification";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const q = req.query.q as string;
    if (!q || q.length < 2) return res.json({ drivers: [], vehicles: [] });
    
    const regex = new (RegExp as any)(q, "i");
    const drivers = await Driver.find({ 
      $or: [{ name: regex }, { licenseNumber: regex }] 
    }).limit(5);
    
    const vehicles = await Vehicle.find({
      $or: [{ regNo: regex }, { modelName: regex }]
    }).limit(5);

    res.json({ drivers, vehicles });
  } catch (error) {
    res.status(500).json({ message: "Search error" });
  }
});

router.get("/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

router.put("/notifications/read", async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ message: "Marked all as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications" });
  }
});

export default router;
