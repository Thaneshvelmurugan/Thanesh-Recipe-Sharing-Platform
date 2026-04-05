import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthGate } from "../components/AuthGate";
import { RecipeCard } from "../components/RecipeCard";
import { useAuth } from "../context/AuthContext";
import { dietaryOptions } from "../data/constants";
import { api } from "../lib/api";

export const DashboardPage = () => {
  const { token, setUser, user } = useAuth();
  const [data, setData] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    dietaryPreferences: user?.dietaryPreferences?.join(", ") || ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const dashboard = await api.get("/users/dashboard", token);
      setData(dashboard);
    };

    if (token) loadDashboard();
  }, [token]);

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
      dietaryPreferences: user?.dietaryPreferences?.join(", ") || ""
    });
  }, [user]);

  const saveProfile = async (event) => {
    event.preventDefault();
    const payload = {
      ...profileForm,
      dietaryPreferences: profileForm.dietaryPreferences
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };
    const updated = await api.put("/users/me", payload, token);
    setUser({
      id: updated._id,
      name: updated.name,
      email: updated.email,
      avatar: updated.avatar,
      bio: updated.bio,
      dietaryPreferences: updated.dietaryPreferences,
      followersCount: updated.followers.length,
      followingCount: updated.following.length
    });
    setMessage("Profile updated");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <AuthGate title="Sign in to open your dashboard">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-clay">Profile</p>
              <h1 className="mt-3 font-display text-4xl text-ink">Your cooking identity</h1>
              <form onSubmit={saveProfile} className="mt-6 space-y-4">
                <input
                  value={profileForm.name}
                  onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Name"
                  className="w-full rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
                />
                <input
                  value={profileForm.avatar}
                  onChange={(event) => setProfileForm((current) => ({ ...current, avatar: event.target.value }))}
                  placeholder="Avatar URL"
                  className="w-full rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
                />
                <textarea
                  value={profileForm.bio}
                  onChange={(event) => setProfileForm((current) => ({ ...current, bio: event.target.value }))}
                  placeholder="Bio"
                  rows="4"
                  className="w-full rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
                />
                <input
                  list="dietary-suggestions"
                  value={profileForm.dietaryPreferences}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, dietaryPreferences: event.target.value }))
                  }
                  placeholder="Dietary preferences, comma separated"
                  className="w-full rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
                />
                <datalist id="dietary-suggestions">
                  {dietaryOptions.filter((option) => option !== "All").map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
                {message && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
                <button type="submit" className="rounded-full bg-ink px-6 py-3 text-white">
                  Save profile
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] bg-basil p-8 text-white shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-white/70">Quick links</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/recipes/new" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-basil">
                  Submit recipe
                </Link>
                <Link to="/meal-plans" className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold">
                  Update meal plan
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-clay">Your submissions</p>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {data?.myRecipes?.length ? (
                  data.myRecipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)
                ) : (
                  <div className="rounded-[2rem] bg-white p-8 shadow-soft">
                    <p className="text-ink/70">No recipes yet. Share your first dish to start your collection.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-clay">Saved favorites</p>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {data?.favorites?.length ? (
                  data.favorites.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)
                ) : (
                  <div className="rounded-[2rem] bg-white p-8 shadow-soft">
                    <p className="text-ink/70">Favorite recipes from the community to build your own cookbook.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AuthGate>
    </section>
  );
};
