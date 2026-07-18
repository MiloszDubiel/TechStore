import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  createProfile,
  getProfile,
  getProducts,
  deleteProduct,
  editSeller,
  getSellerPage,
  createProduct,
  uploadProductImages as uploadProductImagesController,
  updateProduct,
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

router.post("/products", verifyToken, createProduct);

router.post(
  "/products/:id/images",
  verifyToken,
  uploadProductImages.array("images", 8),
  uploadProductImagesController,
);

router.get("/get-my-profile", verifyToken, getProfile);

router.patch(
  "/edit-profile",
  verifyToken,
  uploadSellerLogo.single("logo"),
  editSeller,
);

router.get("/:slug/:id", getSellerPage);

router.patch(
  "/products/:id",
  verifyToken,
  uploadProductImages.array("images", 8),
  updateProduct,
);

export default router;
