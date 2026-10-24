
import express from "express";
import {
  registerUser,
  loginUser,
  getUsers
} from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, getUsers);

export default router;
