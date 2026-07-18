import { Router } from "express";
import {
  getUsers,
  removeUser,
  editUser,
  delUser,
  unactiveUser,
  activeUserController,
  getAdminProductsController,
  hideProductController,
  showProductController,
  deleteProductController,
  updateAdminProduct,
  updateSellerByAdmin,
} from "../controllers/admin.controller";

import { uploadProductImages, uploadSellerLogo } from "../multer";

import { verifyAdmin } from "../middleware/admin.middleware";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/users", verifyToken, verifyAdmin, getUsers);

router.delete("/users/:id", verifyToken, verifyAdmin, removeUser);

router.patch("/users/:id", verifyToken, verifyAdmin, editUser);
router.delete("/users/:id", verifyToken, verifyAdmin, delUser);
router.patch("/users/ban/:id", verifyToken, verifyAdmin, unactiveUser);
router.patch(
  "/users/activate/:id/",
  verifyToken,
  verifyAdmin,
  activeUserController,
);

router.get("/products", verifyToken, verifyAdmin, getAdminProductsController);

router.patch(
  "/products/:id/hide",
  verifyToken,
  verifyAdmin,
  hideProductController,
);

router.patch(
  "/products/:id/show",
  verifyToken,
  verifyAdmin,
  showProductController,
);

router.patch(
  "/products/:id/delete",
  verifyToken,
  verifyAdmin,
  deleteProductController,
);

router.patch(
  "/products/:id",
  verifyToken,
  verifyAdmin,

  uploadProductImages.array("images", 8),
  updateAdminProduct,
);
router.patch(
  "/users/:id/seller",
  verifyToken,
  verifyAdmin,
  uploadSellerLogo.single("logo"),
  updateSellerByAdmin,
);

export default router;
