import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMyNotifications, markAllAsRead, markAsRead } from "../controller/notificationController.js";

const router = express.Router();

router.get("/me", protect, getMyNotifications);
router.put("/read-all", protect, markAllAsRead);
router.put("/:id/read", protect, markAsRead);

export default router;
