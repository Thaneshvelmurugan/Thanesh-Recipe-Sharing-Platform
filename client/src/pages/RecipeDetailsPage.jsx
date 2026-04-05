import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export const RecipeDetailsPage = () => {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const loadRecipe = async () => {
    const data = await api.get(`/recipes/${id}`);
    setRecipe(data);
  };

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const submitComment = async (event) => {
    event.preventDefault();
    await api.post(`/recipes/${id}/comments`, { content: comment }, token);
    setComment("");
    loadRecipe();
  };

  const submitRating = async () => {
    await api.post(`/recipes/${id}/rate`, { value: Number(rating) }, token);
    loadRecipe();
  };

  const toggleFavorite = async () => {
    await api.post(`/recipes/${id}/favorite`, {}, token);
    loadRecipe();
  };

  const toggleLike = async () => {
    await api.post(`/recipes/${id}/like`, {}, token);
    loadRecipe();
  };

  if (!recipe) {
    return <section className="mx-auto max-w-7xl px-4 py-10">Loading recipe...</section>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <img src={recipe.photoUrl} alt={recipe.title} className="h-[420px] w-full rounded-[2rem] object-cover shadow-soft" />
          <div className="rounded-[2rem] bg-white p-8 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-clay">{recipe.cuisine}</p>
                <h1 className="mt-2 font-display text-5xl text-ink">{recipe.title}</h1>
              </div>
              <div className="rounded-[1.5rem] bg-sand px-5 py-4 text-center">
                <p className="text-sm text-ink/60">Average rating</p>
                <p className="font-display text-3xl text-ink">{recipe.averageRating || 0}★</p>
              </div>
            </div>
            <p className="mt-6 text-lg leading-8 text-ink/70">{recipe.description}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-ink/60">
              <span className="rounded-full bg-sand px-4 py-2">{recipe.cookingTime} mins</span>
              <span className="rounded-full bg-sand px-4 py-2">{recipe.servings} servings</span>
              <span className="rounded-full bg-sand px-4 py-2">{recipe.mealType}</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to={`/profiles/${recipe.author._id}`} className="flex items-center gap-3">
                <img src={recipe.author.avatar} alt={recipe.author.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="text-sm text-ink/60">Shared by</p>
                  <p className="font-semibold text-ink">{recipe.author.name}</p>
                </div>
              </Link>
              {isAuthenticated && (
                <>
                  <button onClick={toggleFavorite} className="rounded-full border border-ink/10 px-5 py-3 text-sm text-ink">
                    Save to favorites
                  </button>
                  <button onClick={toggleLike} className="rounded-full border border-ink/10 px-5 py-3 text-sm text-ink">
                    Like recipe
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-8 shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-clay">Ingredients</p>
              <ul className="mt-5 space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <li key={`${ingredient.name}-${ingredient.quantity}`} className="flex justify-between gap-4 border-b border-stone-100 pb-3">
                    <span className="text-ink">{ingredient.name}</span>
                    <span className="text-ink/60">{ingredient.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] bg-white p-8 shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-clay">Preparation</p>
              <ol className="mt-5 space-y-4">
                {recipe.steps.map((step, index) => (
                  <li key={step.instruction} className="flex gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-basil text-sm text-white">{index + 1}</span>
                    <p className="pt-1 text-ink/75">{step.instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2rem] bg-ink p-6 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-apricot">Video tutorial</p>
            <div className="mt-5 overflow-hidden rounded-[1.5rem]">
              {recipe.videoUrl ? (
                <iframe
                  className="aspect-video w-full"
                  src={recipe.videoUrl}
                  title={`${recipe.title} video tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-white/10 text-white/70">No tutorial added yet.</div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-clay">Community reviews</p>
            {isAuthenticated ? (
              <div className="mt-5 flex flex-wrap gap-3">
                <select
                  value={rating}
                  onChange={(event) => setRating(event.target.value)}
                  className="rounded-full border border-stone-200 bg-sand px-4 py-3"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value} stars
                    </option>
                  ))}
                </select>
                <button onClick={submitRating} className="rounded-full bg-ink px-5 py-3 text-white">
                  Rate recipe
                </button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-ink/60">Sign in to leave a rating or comment.</p>
            )}

            <form onSubmit={submitComment} className="mt-6 space-y-3">
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                disabled={!isAuthenticated}
                rows="4"
                placeholder="Share what worked well, substitutions, or tips"
                className="w-full rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!isAuthenticated || !comment}
                className="rounded-full bg-clay px-5 py-3 text-white disabled:opacity-50"
              >
                Post comment
              </button>
            </form>

            <div className="mt-8 space-y-4">
              {recipe.comments.map((entry) => (
                <article key={entry._id} className="rounded-[1.5rem] bg-sand p-4">
                  <div className="flex items-center gap-3">
                    <img src={entry.user.avatar} alt={entry.user.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-ink">{entry.user.name}</p>
                      <p className="text-xs text-ink/50">{new Date(entry.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink/70">{entry.content}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
