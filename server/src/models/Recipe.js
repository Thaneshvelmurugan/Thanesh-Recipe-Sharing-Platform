import mongoose from "mongoose";

const recipeIngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const recipeStepSchema = new mongoose.Schema(
  {
    instruction: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, required: true, min: 1, max: 5 }
  },
  { timestamps: true }
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    dietaryPreferences: { type: [String], default: [] },
    mealType: { type: String, required: true, trim: true },
    cookingTime: { type: Number, required: true, min: 1 },
    servings: { type: Number, required: true, min: 1 },
    ingredients: { type: [recipeIngredientSchema], required: true },
    steps: { type: [recipeStepSchema], required: true },
    photoUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: { type: [commentSchema], default: [] },
    ratings: { type: [ratingSchema], default: [] },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

recipeSchema.virtual("averageRating").get(function getAverageRating() {
  if (!this.ratings.length) return 0;
  const total = this.ratings.reduce((sum, rating) => sum + rating.value, 0);
  return Number((total / this.ratings.length).toFixed(1));
});

recipeSchema.set("toJSON", { virtuals: true });
recipeSchema.set("toObject", { virtuals: true });

export const Recipe = mongoose.model("Recipe", recipeSchema);
