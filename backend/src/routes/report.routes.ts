import { Router } from "express";
import {
  createReport,
  getReport,
  getReports,
  updateReportStatus,
  deleteReport,
} from "../controllers/report.controller";

import { verifyToken } from "../middleware/auth.middleware";
import { verifyAdmin } from "../middleware/admin.middleware";

const router = Router();

router.post("/", verifyToken, createReport);

router.get("/", verifyToken, verifyAdmin, getReports);

router.get("/:id", verifyToken, verifyAdmin, getReport);

router.patch("/:id/status", verifyToken, verifyAdmin, updateReportStatus);

router.delete("/:id", verifyToken, verifyAdmin, deleteReport);

export default router;
