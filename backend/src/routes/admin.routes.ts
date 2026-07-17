import { Router } from "express";
import {
  getUsers,
  removeUser,
  editUser,
  delUser,
  unactiveUser,
} from "../controllers/admin.controller";

import { verifyAdmin } from "../middleware/admin.middleware";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/users", verifyToken, verifyAdmin, getUsers);

router.delete("/users/:id", verifyToken, verifyAdmin, removeUser);

router.patch("/users/:id", verifyToken, verifyAdmin, editUser);
router.delete("/users/:id", verifyToken, verifyAdmin, delUser);
router.patch("/users/ban/:id", verifyToken, verifyAdmin, delUser);

export default router;
