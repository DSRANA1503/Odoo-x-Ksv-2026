import { Router } from "express";
import { z } from "zod";
import { loginUser, registerUser } from "../controllers/authController";
import { validate } from "../middleware/validationMiddleware";

const router = Router();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
  })
});

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst", "Admin"])
  })
});

router.post("/login", validate(loginSchema), loginUser);
router.post("/register", validate(registerSchema), registerUser);

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
