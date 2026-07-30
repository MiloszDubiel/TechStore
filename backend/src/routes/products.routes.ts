import { Router } from "express";
import {
  getOffersFromDatabase,
  getProductByID,
  getProductByExternalID,
  orderProdcuts,
  getCategories,
  getSubcategories,
  scrapeProdcuts,
} from "../controllers/prodcuts.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { getOrders, getOrderDetails } from "../controllers/settings.controller";

const router = Router();

router.get("/products", getOffersFromDatabase);
router.get("/products/:slug/:id", getProductByExternalID);
router.get("/products/:id", getProductByID);
router.post("/products/order", orderProdcuts);
router.get("/orders/", verifyToken, getOrders);
router.get("/orders/:id", verifyToken, getOrderDetails);
router.get("/categories", verifyToken, getCategories);
router.get("/subcategories", verifyToken, getSubcategories);
router.get("/scrape", scrapeProdcuts);

export default router;
