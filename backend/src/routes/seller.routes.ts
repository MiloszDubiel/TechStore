import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  createProfile,
  getProfile,
  getProducts,
  addProduct,
  deleteProduct,
} from "../controllers/seller.controller";
import { uploadSellerLogo, uploadProductImages } from "../multer";

const router = Router();

router.post(
  "/create",
  verifyToken,
  uploadSellerLogo.single("logo"),
  createProfile,
);

router.get("/products", verifyToken, getProducts);
router.delete("/products/:id", verifyToken, deleteProduct);

router.post(
  "/products",
  verifyToken,
  uploadProductImages.array("images", 8),
  addProduct,
);
router.get("/get-my-profile/", verifyToken, getProfile);

export default router;
