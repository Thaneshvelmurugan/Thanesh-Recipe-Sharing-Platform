import mongoose from "mongoose";
import { connectDb } from "./db.js";
import { MealPlan } from "./models/MealPlan.js";
import { Recipe } from "./models/Recipe.js";
import { User } from "./models/User.js";

const seed = async () => {
  await connectDb();

  await Promise.all([User.deleteMany({}), Recipe.deleteMany({}), MealPlan.deleteMany({})]);

  const [maya, ethan] = await User.create([
    {
      name: "Maya Singh",
      email: "maya@example.com",
      password: "password123",
      bio: "Home cook focused on nourishing weekday dinners.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      dietaryPreferences: ["Vegetarian", "High Protein"]
    },
    {
      name: "Ethan Brooks",
      email: "ethan@example.com",
      password: "password123",
      bio: "Weekend meal prep fan and pasta enthusiast.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      dietaryPreferences: ["Mediterranean"]
    }
  ]);

  maya.following.push(ethan._id);
  ethan.followers.push(maya._id);
  await maya.save();
  await ethan.save();

  const recipes = await Recipe.create([
    {
      title: "Creamy Tuscan Chickpea Pasta",
      description: "A one-pan comfort dinner with spinach, sun-dried tomatoes, and a silky garlic cream sauce.",
      cuisine: "Italian",
      dietaryPreferences: ["Vegetarian"],
      mealType: "Dinner",
      cookingTime: 30,
      servings: 4,
      ingredients: [
        { name: "Pasta", quantity: "300g" },
        { name: "Chickpeas", quantity: "1 can" },
        { name: "Spinach", quantity: "2 cups" },
        { name: "Sun-dried tomatoes", quantity: "1/2 cup" }
      ],
      steps: [
        { instruction: "Cook the pasta until al dente." },
        { instruction: "Saute garlic with sun-dried tomatoes and chickpeas." },
        { instruction: "Add cream, spinach, and toss the pasta through the sauce." }
      ],
      photoUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/1-SJGQ2HLp8",
      author: maya._id,
      ratings: [
        { user: ethan._id, value: 5 }
      ],
      comments: [
        { user: ethan._id, content: "This was perfect for meal prep and reheated beautifully." }
      ],
      likes: [ethan._id]
    },
    {
      title: "Lemon Herb Chicken Bowls",
      description: "Bright grilled chicken with quinoa, cucumber salad, and a lemon yogurt drizzle.",
      cuisine: "Mediterranean",
      dietaryPreferences: ["High Protein", "Gluten Free"],
      mealType: "Lunch",
      cookingTime: 35,
      servings: 4,
      ingredients: [
        { name: "Chicken breast", quantity: "500g" },
        { name: "Quinoa", quantity: "1 cup" },
        { name: "Cucumber", quantity: "1 large" },
        { name: "Greek yogurt", quantity: "1/2 cup" }
      ],
      steps: [
        { instruction: "Cook quinoa and grill the seasoned chicken." },
        { instruction: "Dice cucumber and mix a quick lemon yogurt sauce." },
        { instruction: "Assemble bowls and finish with herbs." }
      ],
      photoUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/o8jI9H1LQxA",
      author: ethan._id,
      ratings: [
        { user: maya._id, value: 4 }
      ],
      comments: [
        { user: maya._id, content: "Fresh, quick, and super adaptable with whatever veggies I had." }
      ],
      likes: [maya._id]
    }
  ]);

  maya.favorites.push(recipes[1]._id);
  ethan.favorites.push(recipes[0]._id);
  await maya.save();
  await ethan.save();

  await MealPlan.create({
    user: maya._id,
    title: "Balanced Weeknight Plan",
    weekStart: "2026-04-06",
    isShared: true,
    entries: [
      { day: "Monday", mealSlot: "Dinner", recipe: recipes[0]._id, notes: "Add extra chili flakes." },
      { day: "Wednesday", mealSlot: "Lunch", recipe: recipes[1]._id, notes: "Prep double quinoa." }
    ]
  });

  console.log("Seed complete");
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
