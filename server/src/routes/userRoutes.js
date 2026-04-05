import express from "express";
import { getDashboard, getProfile, toggleFollow, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/dashboard", protect, asyncHandler(getDashboard));
router.get("/:id", asyncHandler(getProfile));
router.put("/me", protect, asyncHandler(updateProfile));
router.post("/:id/follow", protect, asyncHandler(toggleFollow));

export default router;
