import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notifications.controller";

import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", verifyToken, getNotifications);

router.patch("/:id/read", verifyToken, markNotificationAsRead);
router.patch("/read-all", verifyToken, markAllNotificationsAsRead);

router.delete("/:id/delete", verifyToken, deleteNotification);

export default router;
