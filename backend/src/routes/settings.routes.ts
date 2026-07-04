import { Router } from "express";
import { updateUserProfile } from "../controllers/settings.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

// aktualizacja danych użytkownika
router.patch("/edit-user/personal-data", verifyToken, updateUserProfile);

export default router;
