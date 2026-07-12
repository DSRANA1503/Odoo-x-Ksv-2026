import express from "express";
import { Driver } from "../models/Driver";
import { Vehicle } from "../models/Vehicle";

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
  // Static notifications for demo, normally this would come from a DB
  res.json([
    {
      title: "New Trip Dispatched",
      message: "Trip TR001 to Ahmedabad Hub started.",
      createdAt: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      title: "Maintenance Alert",
      message: "Vehicle VAN-05 requires oil change.",
      createdAt: new Date(Date.now() - 60 * 60 * 1000)
    }
  ]);
});

export default router;
