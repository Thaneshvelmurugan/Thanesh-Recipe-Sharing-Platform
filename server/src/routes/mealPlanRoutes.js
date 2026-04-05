import express from "express";
import { createMealPlan, listMealPlans, updateMealPlan } from "../controllers/mealPlanController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", protect, asyncHandler(listMealPlans));
router.post("/", protect, asyncHandler(createMealPlan));
router.put("/:id", protect, asyncHandler(updateMealPlan));

export default router;
