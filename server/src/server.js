import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDb } from "./db.js";
import { config } from "./config.js";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";

const app = express();

app.use(
  cors({
    origin: config.clientUrl
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meal-plans", mealPlanRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: error.message || "Server error" });
});

connectDb()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });
