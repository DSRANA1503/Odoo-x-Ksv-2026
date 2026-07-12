import { Router } from "express";
import { z } from "zod";
import { getFuelLogs, getExpenses, logFuel, logExpense } from "../controllers/financeController";
import { validate } from "../middleware/validationMiddleware";

const router = Router();

const fuelSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1, "Vehicle ID is required"),
    liters: z.number().positive("Liters must be positive"),
    cost: z.number().positive("Cost must be positive"),
    date: z.string().optional()
  })
});

const expenseSchema = z.object({
  body: z.object({
    tripId: z.string().optional(),
    vehicleId: z.string().min(1, "Vehicle ID is required"),
    type: z.enum(["Toll", "Maintenance", "Misc"]),
    amount: z.number().positive("Amount must be positive"),
    description: z.string().optional(),
    date: z.string().optional()
  })
});

router.route("/fuel")
  .get(getFuelLogs)
  .post(validate(fuelSchema), logFuel);

router.route("/expense")
  .get(getExpenses)
  .post(validate(expenseSchema), logExpense);

export default router;
