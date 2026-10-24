
import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  sendMessage,
  getMessages,
  deleteMessage
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:userId", protect, getMessages);
router.delete("/:messageId", protect, deleteMessage);

export default router;
