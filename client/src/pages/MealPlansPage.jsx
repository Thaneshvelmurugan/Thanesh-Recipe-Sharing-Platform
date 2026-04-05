import { useEffect, useMemo, useState } from "react";
import { AuthGate } from "../components/AuthGate";
import { useAuth } from "../context/AuthContext";
import { mealSlots, weekdays } from "../data/constants";
import { api } from "../lib/api";

export const MealPlansPage = () => {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [form, setForm] = useState({
    title: "My Weekly Menu",
    weekStart: new Date().toISOString().slice(0, 10),
    isShared: true,
    entries: [{ day: "Monday", mealSlot: "Dinner", recipe: "", notes: "" }]
  });

  const loadData = async () => {
    const [recipesData, mealPlanData] = await Promise.all([api.get("/recipes"), api.get("/meal-plans", token)]);
    setRecipes(recipesData);
    setMealPlans(mealPlanData);
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const addEntry = () => {
    setForm((current) => ({
      ...current,
      entries: [...current.entries, { day: "Tuesday", mealSlot: "Lunch", recipe: "", notes: "" }]
    }));
  };

  const updateEntry = (index, key, value) => {
    setForm((current) => ({
      ...current,
      entries: current.entries.map((entry, entryIndex) => (entryIndex === index ? { ...entry, [key]: value } : entry))
    }));
  };

  const createMealPlan = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      entries: form.entries.filter((entry) => entry.recipe)
    };
    await api.post("/meal-plans", payload, token);
    setForm({
      title: "My Weekly Menu",
      weekStart: new Date().toISOString().slice(0, 10),
      isShared: true,
      entries: [{ day: "Monday", mealSlot: "Dinner", recipe: "", notes: "" }]
    });
    loadData();
  };

  const shoppingHighlights = useMemo(() => mealPlans[0]?.shoppingList || [], [mealPlans]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <AuthGate title="Sign in to create meal plans">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-clay">Weekly planner</p>
            <h1 className="mt-3 font-display text-4xl text-ink">Turn saved inspiration into a clear plan for the week.</h1>
            <form onSubmit={createMealPlan} className="mt-8 space-y-4">
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Meal plan title"
                className="w-full rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
              />
              <input
                type="date"
                value={form.weekStart}
                onChange={(event) => setForm((current) => ({ ...current, weekStart: event.target.value }))}
                className="w-full rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
              />
              {form.entries.map((entry, index) => (
                <div key={`${entry.day}-${index}`} className="grid gap-3 rounded-[1.5rem] bg-sand p-4 md:grid-cols-2">
                  <select
                    value={entry.day}
                    onChange={(event) => updateEntry(index, "day", event.target.value)}
                    className="rounded-2xl border border-stone-200 bg-white px-4 py-3"
                  >
                    {weekdays.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <select
                    value={entry.mealSlot}
                    onChange={(event) => updateEntry(index, "mealSlot", event.target.value)}
                    className="rounded-2xl border border-stone-200 bg-white px-4 py-3"
                  >
                    {mealSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <select
                    value={entry.recipe}
                    onChange={(event) => updateEntry(index, "recipe", event.target.value)}
                    className="rounded-2xl border border-stone-200 bg-white px-4 py-3 md:col-span-2"
                  >
                    <option value="">Select a recipe</option>
                    {recipes.map((recipe) => (
                      <option key={recipe._id} value={recipe._id}>
                        {recipe.title}
                      </option>
                    ))}
                  </select>
                  <input
                    value={entry.notes}
                    onChange={(event) => updateEntry(index, "notes", event.target.value)}
                    placeholder="Prep notes"
                    className="rounded-2xl border border-stone-200 bg-white px-4 py-3 md:col-span-2"
                  />
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={addEntry} className="rounded-full border border-ink/10 px-5 py-3 text-ink">
                  Add day
                </button>
                <button type="submit" className="rounded-full bg-ink px-6 py-3 text-white">
                  Save meal plan
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <div className="rounded-[2rem] bg-basil p-8 text-white shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-white/70">Shopping list preview</p>
              <div className="mt-5 grid gap-3">
                {shoppingHighlights.length ? (
                  shoppingHighlights.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                      <span>{item.name}</span>
                      <span className="text-white/70">{item.quantity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/70">Save a meal plan to generate your grocery list.</p>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.25em] text-clay">Saved plans</p>
              {mealPlans.map((mealPlan) => (
                <article key={mealPlan._id} className="rounded-[2rem] bg-white p-6 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-3xl text-ink">{mealPlan.title}</h2>
                      <p className="mt-2 text-sm text-ink/60">Week of {mealPlan.weekStart}</p>
                    </div>
                    <span className="rounded-full bg-sand px-4 py-2 text-sm text-ink">{mealPlan.entries.length} meals</span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {mealPlan.entries.map((entry) => (
                      <div key={entry._id} className="rounded-2xl bg-sand px-4 py-3">
                        <p className="font-semibold text-ink">
                          {entry.day} - {entry.mealSlot}
                        </p>
                        <p className="text-sm text-ink/70">{entry.recipe?.title}</p>
                        {entry.notes && <p className="mt-1 text-xs text-ink/55">{entry.notes}</p>}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </AuthGate>
    </section>
  );
};
