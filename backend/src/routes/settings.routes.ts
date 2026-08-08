import { Router } from "express";
import {
  deleteAddress,
  editUserSecurity,
  getPasswordUpdatedAt,
  updateUserProfile,
} from "../controllers/settings.controller";
import { verifyToken } from "../middleware/auth.middleware";
import {
  getAdresses,
  setAdresses,
  updateAdresses,
  getOrderDetails,
  getOrders,
} from "../controllers/settings.controller";

const router = Router();

router.patch("/edit-user/personal-data", verifyToken, updateUserProfile);
router.get("/edit-user/adresses/", verifyToken, getAdresses);
router.post("/edit-user/adresses", verifyToken, setAdresses);
router.patch("/edit-user/adresses", verifyToken, updateAdresses);
router.delete("/edit-user/adresses/:id", verifyToken, deleteAddress);
router.patch("/edit-user/security", verifyToken, editUserSecurity);
router.get(
  "/edit-user/security/password-date",
  verifyToken,
  getPasswordUpdatedAt,
);

export default router;
