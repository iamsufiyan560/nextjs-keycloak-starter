import express from "express";
import { getProfile } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";

const router = express.Router();

router.get("/profile", authenticate, getProfile);

// Example: Only admin and manager can access this route
// router.get('/admin-data', authenticate, authorize('admin', 'manager'), getAdminData);
export default router;
