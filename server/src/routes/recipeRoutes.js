import express from "express";
import {
  commentOnRecipe,
  createRecipe,
  getRecipe,
  listRecipes,
  rateRecipe,
  toggleFavorite,
  toggleLike,
  updateRecipe
} from "../controllers/recipeController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(listRecipes));
router.get("/:id", asyncHandler(getRecipe));
router.post("/", protect, asyncHandler(createRecipe));
router.put("/:id", protect, asyncHandler(updateRecipe));
router.post("/:id/rate", protect, asyncHandler(rateRecipe));
router.post("/:id/comments", protect, asyncHandler(commentOnRecipe));
router.post("/:id/favorite", protect, asyncHandler(toggleFavorite));
router.post("/:id/like", protect, asyncHandler(toggleLike));

export default router;
