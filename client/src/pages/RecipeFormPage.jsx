import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthGate } from "../components/AuthGate";
import { useAuth } from "../context/AuthContext";
import { dietaryOptions, mealTypes } from "../data/constants";
import { api } from "../lib/api";

const initialForm = {
  title: "",
  description: "",
  cuisine: "",
  mealType: "Dinner",
  cookingTime: 30,
  servings: 2,
  ingredients: "Pasta|200g\nOlive oil|2 tbsp",
  steps: "Boil water\nCook ingredients\nServe warm",
  dietaryPreferences: "Vegetarian",
  photoUrl: "",
  videoUrl: ""
};

export const RecipeFormPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        cookingTime: Number(form.cookingTime),
        servings: Number(form.servings),
        dietaryPreferences: form.dietaryPreferences
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        ingredients: form.ingredients
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [name, quantity] = line.split("|");
            return { name: name.trim(), quantity: (quantity || "").trim() };
          }),
        steps: form.steps
          .split("\n")
          .map((instruction) => instruction.trim())
          .filter(Boolean)
          .map((instruction) => ({ instruction }))
      };

      const recipe = await api.post("/recipes", payload, token);
      navigate(`/recipes/${recipe._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <AuthGate title="Sign in to share your recipe">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-clay">Recipe submission</p>
          <h1 className="mt-3 font-display text-4xl text-ink">Share a dish with photos, steps, and a video tutorial.</h1>
          <form onSubmit={submitHandler} className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              required
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Recipe title"
              className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay md:col-span-2"
            />
            <textarea
              required
              rows="4"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Describe what makes this recipe special"
              className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay md:col-span-2"
            />
            <input
              required
              value={form.cuisine}
              onChange={(event) => setForm((current) => ({ ...current, cuisine: event.target.value }))}
              placeholder="Cuisine"
              className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
            />
            <select
              value={form.mealType}
              onChange={(event) => setForm((current) => ({ ...current, mealType: event.target.value }))}
              className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
            >
              {mealTypes.map((mealType) => (
                <option key={mealType} value={mealType}>
                  {mealType}
                </option>
              ))}
            </select>
            <input
              required
              type="number"
              min="1"
              value={form.cookingTime}
              onChange={(event) => setForm((current) => ({ ...current, cookingTime: event.target.value }))}
              placeholder="Cooking time"
              className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
            />
            <input
              required
              type="number"
              min="1"
              value={form.servings}
              onChange={(event) => setForm((current) => ({ ...current, servings: event.target.value }))}
              placeholder="Servings"
              className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
            />
            <input
              value={form.photoUrl}
              onChange={(event) => setForm((current) => ({ ...current, photoUrl: event.target.value }))}
              placeholder="Photo URL"
              className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay md:col-span-2"
            />
            <input
              value={form.videoUrl}
              onChange={(event) => setForm((current) => ({ ...current, videoUrl: event.target.value }))}
              placeholder="Embedded YouTube URL"
              className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay md:col-span-2"
            />
            <input
              list="dietary-options"
              value={form.dietaryPreferences}
              onChange={(event) => setForm((current) => ({ ...current, dietaryPreferences: event.target.value }))}
              placeholder="Dietary preferences, comma separated"
              className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay md:col-span-2"
            />
            <datalist id="dietary-options">
              {dietaryOptions.filter((option) => option !== "All").map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
            <textarea
              required
              rows="6"
              value={form.ingredients}
              onChange={(event) => setForm((current) => ({ ...current, ingredients: event.target.value }))}
              placeholder="One ingredient per line using Ingredient|Quantity"
              className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
            />
            <textarea
              required
              rows="6"
              value={form.steps}
              onChange={(event) => setForm((current) => ({ ...current, steps: event.target.value }))}
              placeholder="One preparation step per line"
              className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
            />
            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{error}</p>}
            <button type="submit" className="rounded-full bg-ink px-6 py-3 text-white md:col-span-2">
              Publish recipe
            </button>
          </form>
        </div>
      </AuthGate>
    </section>
  );
};
