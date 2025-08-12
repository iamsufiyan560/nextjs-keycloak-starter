import express from "express";
import {
  handleCallback,
  checkAuth,
  logout,
  refreshTokens,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/callback", handleCallback);
router.post("/refresh", authenticate, refreshTokens);

router.get("/check", authenticate, checkAuth);
router.post("/logout", authenticate, logout);

export default router;
