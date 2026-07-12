import { Router } from "express";
import { z } from "zod";
import { getMaintenanceLogs, logMaintenance, completeMaintenance } from "../controllers/maintenanceController";
import { validate } from "../middleware/validationMiddleware";

const router = Router();

const maintenanceSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1, "Vehicle is required"),
    description: z.string().min(2, "Description is required"),
    cost: z.number().nonnegative("Cost must be non-negative")
  })
});

router.route("/")
  .get(getMaintenanceLogs)
  .post(validate(maintenanceSchema), logMaintenance);

router.post("/:id/complete", completeMaintenance);

export default router;
