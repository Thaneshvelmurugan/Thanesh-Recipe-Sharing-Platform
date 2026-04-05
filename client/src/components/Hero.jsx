import { Link } from "react-router-dom";

export const Hero = () => (
  <section className="overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-8">
    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p className="mb-4 inline-flex rounded-full border border-clay/20 bg-white/80 px-4 py-2 text-sm text-clay shadow-soft">
          Weekly meal planning, social cooking, and ingredient-first discovery
        </p>
        <h1 className="max-w-3xl font-display text-5xl leading-tight text-ink sm:text-6xl">
          Build your next favorite recipe collection with a kitchen-first community.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/75">
          Share recipes with photos and video tutorials, filter by dietary needs, save favorites, and turn discoveries
          into a week of planned meals and instant shopping lists.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/recipes/new" className="rounded-full bg-ink px-6 py-3 text-white transition hover:bg-clay">
            Share a Recipe
          </Link>
          <Link to="/meal-plans" className="rounded-full border border-ink/15 bg-white px-6 py-3 text-ink transition hover:border-clay">
            Plan Your Week
          </Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-4 shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80"
            alt="Fresh recipe"
            className="h-72 w-full rounded-[1.5rem] object-cover"
          />
        </div>
        <div className="space-y-4">
          <div className="rounded-[2rem] bg-basil p-6 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-white/70">Ingredient search</p>
            <p className="mt-4 font-display text-3xl">Find dinner from what is already in your kitchen.</p>
          </div>
          <div className="rounded-[2rem] bg-apricot/70 p-6 text-ink shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-ink/60">Community</p>
            <p className="mt-4 font-display text-3xl">Follow creators, collect favorites, and cook together.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
