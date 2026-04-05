import mongoose from "mongoose";
import { Recipe } from "../models/Recipe.js";
import { User } from "../models/User.js";

const buildRecipeQuery = (query) => {
  const filters = {};

  if (query.q) {
    filters.$or = [
      { title: { $regex: query.q, $options: "i" } },
      { description: { $regex: query.q, $options: "i" } },
      { "ingredients.name": { $regex: query.q, $options: "i" } }
    ];
  }

  if (query.cuisine) {
    filters.cuisine = query.cuisine;
  }

  if (query.mealType) {
    filters.mealType = query.mealType;
  }

  if (query.dietary && query.dietary !== "All") {
    filters.dietaryPreferences = query.dietary;
  }

  if (query.ingredients) {
    const ingredients = query.ingredients.split(",").map((item) => item.trim()).filter(Boolean);
    if (ingredients.length) {
      filters["ingredients.name"] = {
        $all: ingredients.map((ingredient) => new RegExp(ingredient, "i"))
      };
    }
  }

  if (query.maxTime) {
    filters.cookingTime = { ...(filters.cookingTime || {}), $lte: Number(query.maxTime) };
  }

  return filters;
};

export const listRecipes = async (req, res) => {
  const filters = buildRecipeQuery(req.query);
  const recipes = await Recipe.find(filters)
    .populate("author", "name avatar")
    .sort({ createdAt: -1 });

  const minRating = Number(req.query.minRating || 0);
  const filtered = recipes.filter((recipe) => recipe.averageRating >= minRating);

  res.json(filtered);
};

export const getRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
    .populate("author", "name avatar bio")
    .populate("comments.user", "name avatar")
    .populate("ratings.user", "name");

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  res.json(recipe);
};

export const createRecipe = async (req, res) => {
  const recipe = await Recipe.create({
    ...req.body,
    author: req.user._id
  });

  const createdRecipe = await Recipe.findById(recipe._id).populate("author", "name avatar");
  res.status(201).json(createdRecipe);
};

export const updateRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  if (recipe.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed to edit this recipe" });
  }

  Object.assign(recipe, req.body);
  await recipe.save();
  res.json(await Recipe.findById(recipe._id).populate("author", "name avatar"));
};

export const rateRecipe = async (req, res) => {
  const { value } = req.body;
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  const existing = recipe.ratings.find((rating) => rating.user.toString() === req.user._id.toString());
  if (existing) {
    existing.value = value;
  } else {
    recipe.ratings.push({ user: req.user._id, value });
  }

  await recipe.save();
  res.json({ averageRating: recipe.averageRating, ratingCount: recipe.ratings.length });
};

export const commentOnRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  recipe.comments.unshift({
    user: req.user._id,
    content: req.body.content
  });
  await recipe.save();

  const updatedRecipe = await Recipe.findById(recipe._id).populate("comments.user", "name avatar");
  res.status(201).json(updatedRecipe.comments);
};

export const toggleFavorite = async (req, res) => {
  const user = await User.findById(req.user._id);
  const recipeId = new mongoose.Types.ObjectId(req.params.id);
  const isFavorited = user.favorites.some((id) => id.toString() === req.params.id);

  if (isFavorited) {
    user.favorites = user.favorites.filter((id) => id.toString() !== req.params.id);
  } else {
    user.favorites.push(recipeId);
  }

  await user.save();
  res.json({ favorited: !isFavorited, favoritesCount: user.favorites.length });
};

export const toggleLike = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  const isLiked = recipe.likes.some((id) => id.toString() === req.user._id.toString());
  if (isLiked) {
    recipe.likes = recipe.likes.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    recipe.likes.push(req.user._id);
  }

  await recipe.save();
  res.json({ liked: !isLiked, likesCount: recipe.likes.length });
};
