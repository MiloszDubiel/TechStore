import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { createSeller, getProfile } from "../controllers/seller.controller";
import { uploadSellerLogo } from "../multer";
import { getSellerByUserId } from "../services/seller.services";

const router = Router();

router.post(
  "/create",
  verifyToken,
  uploadSellerLogo.single("logo"),
  createSeller,
);

router.get("/get-my-profile/:id", verifyToken, getProfile);

export default router;
