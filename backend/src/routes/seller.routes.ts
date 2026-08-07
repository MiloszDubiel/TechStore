import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { verifyAdmin } from "../middleware/admin.middleware";
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
  getSellerData,
  getSellerOverview,
  getSellerOrderDetails,
  getSellerOrders,
  updateSellerOrderStatus,
  getSubParma,
  getProductsByID,
} from "../controllers/seller.controller";

import { uploadSellerLogo, uploadProductImages } from "../multer";

const router = Router();

router.post(
  "/create",
  verifyToken,
  uploadSellerLogo.single("logo"),
  createProfile,
);

router.get("/users/:id/seller", verifyToken, verifyAdmin, getSellerData);
router.get("/products", verifyToken, getProducts);
router.get("/products/:id", verifyToken, getProductsByID);

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

router.get("/:slug/:seller_id", getSellerPage);

router.patch(
  "/products/:id",
  verifyToken,
  uploadProductImages.array("images", 8),
  updateProduct,
);

router.get("/dashboard/overview", verifyToken, getSellerOverview);
router.get("/orders", verifyToken, getSellerOrders);

router.get("/orders/:id", verifyToken, getSellerOrderDetails);

router.patch(
  "/orders/:id/status",
  verifyToken,

  updateSellerOrderStatus,
);
router.get("/subcategories/:id/parameters", getSubParma);

export default router;
