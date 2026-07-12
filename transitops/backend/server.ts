import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cron from "node-cron";
import { connectDB } from "./config/db";
import vehicleRoutes from "./routes/vehicleRoutes";
import authRoutes from "./routes/authRoutes";
import driverRoutes from "./routes/driverRoutes";
import tripRoutes from "./routes/tripRoutes";
import maintenanceRoutes from "./routes/maintenanceRoutes";
import financeRoutes from "./routes/financeRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import commonRoutes from "./routes/commonRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { Driver } from "./models/Driver";
import { ReminderLog } from "./models/ReminderLog";
import { sendLicenseExpiryReminder } from "./utils/emailService";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.set("trust proxy", 1);

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Vite development requires inline scripts, disable CSP for now or configure properly
  }));
  app.use(cors());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: "Too many requests from this IP, please try again later."
  });
  app.use("/api", limiter);

  app.use(express.json({ limit: "1mb" }));

  // Connect to MongoDB
  connectDB();

  // Background Job: Check for expiring licenses (runs every day at midnight)
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running cron job: Checking for expiring driver licenses...");
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const expiringDrivers = await Driver.find({
        licenseExpiryDate: {
          $gt: new Date(),
          $lte: thirtyDaysFromNow
        },
        status: { $ne: "Retired" }
      } as any);
      
      if (expiringDrivers.length > 0) {
        console.log(`[ALERT] Found ${expiringDrivers.length} driver(s) with licenses expiring in the next 30 days.`);
        for (const driver of expiringDrivers) {
          console.log(`- ${driver.name} (License: ${driver.licenseNumber}), expires on ${new Date(driver.licenseExpiryDate).toDateString()}`);
          
          // Send email logic
          // Assume user object has an email field, but Driver model in dummy data has 'contactNumber' instead of email. 
          // We will mock the email address for the dummy drivers:
          const email = driver.name.toLowerCase().replace(/\s+/g, '.') + "@transitops.mock";
          const success = await sendLicenseExpiryReminder(email, driver.name, new Date(driver.licenseExpiryDate));
          if (success) {
            await ReminderLog.create({
              driverId: driver._id,
              type: "License Expiry"
            });
          }
        }
      }
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/vehicles", vehicleRoutes);
  app.use("/api/drivers", driverRoutes);
  app.use("/api/trips", tripRoutes);
  app.use("/api/maintenance", maintenanceRoutes);
  app.use("/api/finance", financeRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api", commonRoutes);
  
  // Serve uploads
  app.use("/uploads", express.static(path.join(process.cwd(), "transitops/backend/uploads")));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
    res.json({ 
       status: "ok", 
       message: "TransitOps API is running",
      dbStatus: states[dbStatus as keyof typeof states] || "unknown"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true }, root: 'transitops/frontend',
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Error Handler
  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
