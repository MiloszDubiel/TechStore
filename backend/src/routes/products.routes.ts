import { Router } from "express";
import {
 
  getOffersFromDatabase,
  getProductByID,
  getProductByExternalID,
} from "../controllers/prodcuts.controller";

const router = Router();


router.get("/products", getOffersFromDatabase);
router.get("/products/:slug/:id", getProductByExternalID);
router.get("/products/:id", getProductByID);
export default router;
