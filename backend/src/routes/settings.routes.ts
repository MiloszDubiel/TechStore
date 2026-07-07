import { Router } from "express";
import { updateUserProfile } from "../controllers/settings.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { getAdresses } from "../controllers/settings.controller";

const router = Router();

// aktualizacja danych użytkownika
router.patch("/edit-user/personal-data", verifyToken, updateUserProfile);
router.get("/edit-user/adresses/:id", verifyToken, getAdresses);

export default router;
