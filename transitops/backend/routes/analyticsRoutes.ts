import { Router } from "express";
import { getKPIs, getVehicleAnalytics, exportCSV, exportPDF, getTripsTrend, getRevenueTrend } from "../controllers/analyticsController";

const router = Router();

router.get("/kpis", getKPIs);
router.get("/vehicles", getVehicleAnalytics);
router.get("/export", exportCSV);
router.get("/export/pdf", exportPDF);
router.get("/trips-trend", getTripsTrend);
router.get("/revenue-trend", getRevenueTrend);

export default router;
