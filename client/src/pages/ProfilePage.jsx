import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RecipeCard } from "../components/RecipeCard";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export const ProfilePage = () => {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    const data = await api.get(`/users/${id}`);
    setProfile(data);
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const toggleFollow = async () => {
    await api.post(`/users/${id}/follow`, {}, token);
    loadProfile();
  };

  if (!profile) {
    return <section className="mx-auto max-w-7xl px-4 py-10">Loading profile...</section>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <img src={profile.avatar} alt={profile.name} className="h-24 w-24 rounded-full object-cover" />
            <div>
              <h1 className="font-display text-4xl text-ink">{profile.name}</h1>
              <p className="mt-2 max-w-2xl text-ink/70">{profile.bio}</p>
              <div className="mt-3 flex gap-4 text-sm text-ink/60">
                <span>{profile.followersCount} followers</span>
                <span>{profile.followingCount} following</span>
              </div>
            </div>
          </div>
          {isAuthenticated && (
            <button onClick={toggleFollow} className="rounded-full bg-ink px-6 py-3 text-white">
              Follow chef
            </button>
          )}
        </div>
      </div>

      <div className="mt-10">
        <p className="text-sm uppercase tracking-[0.25em] text-clay">Recipes by {profile.name}</p>
        <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {profile.recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
};
