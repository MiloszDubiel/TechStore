import { Router } from "express";
import {
  deleteAddress,
  updateUserProfile,
} from "../controllers/settings.controller";
import { verifyToken } from "../middleware/auth.middleware";
import {
  getAdresses,
  setAdresses,
  updateAdresses,
} from "../controllers/settings.controller";

const router = Router();

router.patch("/edit-user/personal-data", verifyToken, updateUserProfile);
router.get("/edit-user/adresses/", verifyToken, getAdresses);
router.post("/edit-user/adresses", verifyToken, setAdresses);
router.patch("/edit-user/adresses", verifyToken, updateAdresses);
router.delete("/edit-user/adresses/:id", verifyToken, deleteAddress);

export default router;
