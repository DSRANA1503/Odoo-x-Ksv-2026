import { Router } from "express";
import { z } from "zod";
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, getVehicleDocuments, uploadVehicleDocument } from "../controllers/vehicleController";
import { validate } from "../middleware/validationMiddleware";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'transitops/backend/uploads/'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

const router = Router();

const vehicleSchema = z.object({
  body: z.object({
    regNo: z.string().min(2, "Registration number is required"),
    modelName: z.string().min(2, "Model name is required"),
    type: z.string().min(2, "Type is required"),
    capacity: z.number().positive("Capacity must be positive"),
    odometer: z.number().nonnegative("Odometer must be non-negative"),
    acquisitionCost: z.number().nonnegative("Cost must be non-negative"),
    status: z.enum(["Available", "In Shop", "On Trip", "Retired"]).optional(),
    region: z.string().min(2, "Region is required"),
  })
});

router.route("/")
  .get(getVehicles)
  .post(validate(vehicleSchema), createVehicle);

router.route("/:id")
  .put(validate(vehicleSchema), updateVehicle)
  .delete(deleteVehicle);

router.route("/:id/documents")
  .get(getVehicleDocuments)
  .post(upload.single('file'), uploadVehicleDocument);

export default router;
