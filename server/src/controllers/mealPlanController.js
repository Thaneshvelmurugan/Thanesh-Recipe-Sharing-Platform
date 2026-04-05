import { MealPlan } from "../models/MealPlan.js";

const buildShoppingList = (mealPlan) => {
  const ingredientMap = new Map();

  mealPlan.entries.forEach((entry) => {
    entry.recipe.ingredients.forEach((ingredient) => {
      const key = ingredient.name.toLowerCase();
      if (!ingredientMap.has(key)) {
        ingredientMap.set(key, { name: ingredient.name, quantities: [] });
      }
      ingredientMap.get(key).quantities.push(ingredient.quantity);
    });
  });

  return [...ingredientMap.values()].map((item) => ({
    name: item.name,
    quantity: item.quantities.join(" + ")
  }));
};

export const listMealPlans = async (req, res) => {
  const mealPlans = await MealPlan.find({ user: req.user._id })
    .populate("entries.recipe", "title photoUrl ingredients")
    .sort({ createdAt: -1 });

  res.json(
    mealPlans.map((plan) => ({
      ...plan.toJSON(),
      shoppingList: buildShoppingList(plan)
    }))
  );
};

export const createMealPlan = async (req, res) => {
  const mealPlan = await MealPlan.create({
    ...req.body,
    user: req.user._id
  });

  const populatedMealPlan = await MealPlan.findById(mealPlan._id).populate("entries.recipe", "title photoUrl ingredients");
  res.status(201).json({
    ...populatedMealPlan.toJSON(),
    shoppingList: buildShoppingList(populatedMealPlan)
  });
};

export const updateMealPlan = async (req, res) => {
  const mealPlan = await MealPlan.findById(req.params.id);
  if (!mealPlan) {
    return res.status(404).json({ message: "Meal plan not found" });
  }

  if (mealPlan.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed to edit this meal plan" });
  }

  Object.assign(mealPlan, req.body);
  await mealPlan.save();

  const populatedMealPlan = await MealPlan.findById(mealPlan._id).populate("entries.recipe", "title photoUrl ingredients");
  res.json({
    ...populatedMealPlan.toJSON(),
    shoppingList: buildShoppingList(populatedMealPlan)
  });
};
