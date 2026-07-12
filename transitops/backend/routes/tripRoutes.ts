import { Router } from "express";
import { z } from "zod";
import { getTrips, createTrip, dispatchTrip, completeTrip, cancelTrip } from "../controllers/tripController";
import { validate } from "../middleware/validationMiddleware";

const router = Router();

const createTripSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1, "Vehicle is required"),
    driverId: z.string().min(1, "Driver is required"),
    cargoWeight: z.number().positive("Cargo weight must be positive"),
    plannedDistance: z.number().positive("Distance must be positive"),
    origin: z.string().min(1, "Origin is required"),
    destination: z.string().min(1, "Destination is required")
  })
});

router.route("/")
  .get(getTrips)
  .post(validate(createTripSchema), createTrip);

router.post("/:id/dispatch", dispatchTrip);
router.post("/:id/complete", completeTrip);
router.post("/:id/cancel", cancelTrip);

export default router;
