import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";

import { getMessages } from "../controllers/chat.controller";
import {
  createMessage,
  createConversation,
  getConversations,
} from "../controllers/chat.controller";

const router = Router();

router.get("/conversations/:id/messages", verifyToken, getMessages);

router.post("/messages", verifyToken, createMessage);
router.post("/create-conversations", verifyToken, createConversation);
router.get("/get-conversations", verifyToken, getConversations);

export default router;
