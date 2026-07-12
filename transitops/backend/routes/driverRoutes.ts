import { Router } from "express";
import { z } from "zod";
import { getDrivers, createDriver, updateDriver, deleteDriver, triggerReminders } from "../controllers/driverController";
import { validate } from "../middleware/validationMiddleware";
import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/rbacMiddleware";

const router = Router();

const driverSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is required"),
    licenseNumber: z.string().min(2, "License number is required"),
    licenseCategory: z.string().min(1, "License category is required"),
    licenseExpiryDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
    contactNumber: z.string().min(5, "Contact number is required"),
    status: z.enum(["Available", "On Trip", "Off Duty", "Suspended"]).optional(),
    safetyScore: z.number().min(0).max(100).optional()
  })
});

router.post("/reminders", protect, authorizeRoles("Safety Officer", "Fleet Manager", "Admin"), triggerReminders);

router.route("/")
  .get(getDrivers)
  .post(validate(driverSchema), createDriver);

router.route("/:id")
  .put(validate(driverSchema), updateDriver)
  .delete(deleteDriver);

export default router;
