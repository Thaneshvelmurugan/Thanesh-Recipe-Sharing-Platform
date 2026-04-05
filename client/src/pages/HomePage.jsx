import { useEffect, useMemo, useState } from "react";
import { FilterBar } from "../components/FilterBar";
import { Hero } from "../components/Hero";
import { RecipeCard } from "../components/RecipeCard";
import { api } from "../lib/api";

const defaultFilters = {
  q: "",
  ingredients: "",
  cuisine: "",
  mealType: "",
  dietary: "All",
  minRating: ""
};

export const HomePage = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.get(`/recipes${queryString ? `?${queryString}` : ""}`);
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [queryString]);

  return (
    <div className="pb-16">
      <Hero />
      <FilterBar
        filters={filters}
        onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
      />
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-clay">Browse recipes</p>
            <h2 className="mt-2 font-display text-4xl text-ink">Cook by mood, cuisine, or what is already in your pantry.</h2>
          </div>
          <div className="rounded-full bg-white px-4 py-3 text-sm text-ink shadow-soft">{recipes.length} recipes found</div>
        </div>

        {loading && <p className="rounded-3xl bg-white p-6 text-ink shadow-soft">Loading recipes...</p>}
        {error && <p className="rounded-3xl bg-red-50 p-6 text-red-700 shadow-soft">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
