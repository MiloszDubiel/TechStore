import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  createSeller,
  getProfile,
  getProducts,
  addProduct,
} from "../controllers/seller.controller";
import { uploadSellerLogo, uploadProductImages } from "../multer";

const router = Router();

router.post(
  "/create",
  verifyToken,
  uploadSellerLogo.single("logo"),
  createSeller,
);

router.get("/products", verifyToken, getProducts);

router.post(
  "/products",
  verifyToken,
  uploadProductImages.array("images", 8),
  addProduct,
);
router.get("/get-my-profile/:id", verifyToken, getProfile);

export default router;
