import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm transition ${isActive ? "bg-ink text-white" : "text-ink/70 hover:bg-white"}`;

export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-sand/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-2xl text-ink">
          Savory Circle
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navClass}>
            Discover
          </NavLink>
          <NavLink to="/recipes/new" className={navClass}>
            Share Recipe
          </NavLink>
          <NavLink to="/meal-plans" className={navClass}>
            Meal Planner
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-clay px-4 py-2 text-sm text-white transition hover:bg-ink"
              >
                Sign Out
              </button>
            </>
          ) : (
            <NavLink to="/auth" className={navClass}>
              Sign In
            </NavLink>
          )}
        </nav>
        {isAuthenticated && (
          <Link to="/dashboard" className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-soft">
            <img
              src={user?.avatar || "https://ui-avatars.com/api/?background=8C5E58&color=fff&name=" + encodeURIComponent(user?.name || "U")}
              alt={user?.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-ink">{user?.name}</p>
              <p className="text-xs text-ink/60">Cookbook in progress</p>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};
