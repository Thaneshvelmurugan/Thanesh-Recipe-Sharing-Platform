import mongoose from "mongoose";

const mealEntrySchema = new mongoose.Schema(
  {
    day: { type: String, required: true, trim: true },
    mealSlot: { type: String, required: true, trim: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
    notes: { type: String, default: "", trim: true }
  },
  { _id: true }
);

const mealPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    weekStart: { type: String, required: true, trim: true },
    entries: { type: [mealEntrySchema], default: [] },
    isShared: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const MealPlan = mongoose.model("MealPlan", mealPlanSchema);
