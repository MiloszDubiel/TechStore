import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notifications.controller";

import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", verifyToken, getNotifications);

router.patch("/:id/read", verifyToken, markNotificationAsRead);

router.patch("/read-all", verifyToken, markAllNotificationsAsRead);

export default router;
