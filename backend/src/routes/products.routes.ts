import { Router } from "express";
import {
  getOffersFromDatabase,
  getProductByID,
  getProductByExternalID,
  orderProdcuts,
} from "../controllers/prodcuts.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/products", getOffersFromDatabase);
router.get("/products/:slug/:id", getProductByExternalID);
router.get("/products/:id", getProductByID);
router.post("/products/order", verifyToken, orderProdcuts);

export default router;
