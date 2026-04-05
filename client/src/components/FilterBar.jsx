import { cuisines, dietaryOptions, mealTypes } from "../data/constants";

export const FilterBar = ({ filters, onChange }) => (
  <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-soft lg:grid-cols-6">
      <input
        value={filters.q}
        onChange={(event) => onChange("q", event.target.value)}
        placeholder="Search recipes or ingredients"
        className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay lg:col-span-2"
      />
      <input
        value={filters.ingredients}
        onChange={(event) => onChange("ingredients", event.target.value)}
        placeholder="Ingredients: tomato, basil"
        className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
      />
      <select
        value={filters.cuisine}
        onChange={(event) => onChange("cuisine", event.target.value)}
        className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
      >
        <option value="">All cuisines</option>
        {cuisines.map((cuisine) => (
          <option key={cuisine} value={cuisine}>
            {cuisine}
          </option>
        ))}
      </select>
      <select
        value={filters.mealType}
        onChange={(event) => onChange("mealType", event.target.value)}
        className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
      >
        <option value="">All meal types</option>
        {mealTypes.map((mealType) => (
          <option key={mealType} value={mealType}>
            {mealType}
          </option>
        ))}
      </select>
      <select
        value={filters.dietary}
        onChange={(event) => onChange("dietary", event.target.value)}
        className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
      >
        {dietaryOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="0"
        value={filters.minRating}
        onChange={(event) => onChange("minRating", event.target.value)}
        placeholder="Min rating"
        className="rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
      />
    </div>
  </section>
);
