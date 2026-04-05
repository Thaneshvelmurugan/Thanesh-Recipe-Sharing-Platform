import { Link } from "react-router-dom";

export const RecipeCard = ({ recipe }) => (
  <article className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-soft transition hover:-translate-y-1">
    <img
      src={recipe.photoUrl || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"}
      alt={recipe.title}
      className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
    />
    <div className="space-y-4 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-clay">{recipe.cuisine}</p>
          <h3 className="mt-2 font-display text-2xl text-ink">{recipe.title}</h3>
        </div>
        <div className="rounded-full bg-sand px-3 py-2 text-sm text-ink">{recipe.averageRating || 0}★</div>
      </div>
      <p className="line-clamp-3 text-sm leading-6 text-ink/70">{recipe.description}</p>
      <div className="flex flex-wrap gap-2 text-xs text-ink/60">
        <span className="rounded-full bg-sand px-3 py-2">{recipe.mealType}</span>
        <span className="rounded-full bg-sand px-3 py-2">{recipe.cookingTime} mins</span>
        <span className="rounded-full bg-sand px-3 py-2">{recipe.servings} servings</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">By {recipe.author?.name || "Community chef"}</p>
        <Link to={`/recipes/${recipe._id}`} className="text-sm font-semibold text-clay">
          View recipe
        </Link>
      </div>
    </div>
  </article>
);
