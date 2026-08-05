import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  getUser,
} from "../controllers/auth.controller";

import { optionalAuth } from "../middleware/optiona.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/user", optionalAuth, getUser);

export default router;
