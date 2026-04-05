import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AuthGate = ({ children, title = "Sign in to continue" }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-soft">
      <h2 className="font-display text-3xl text-ink">{title}</h2>
      <p className="mt-4 text-ink/70">Create an account to save recipes, build meal plans, and join the community.</p>
      <Link to="/auth" className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-white">
        Go to sign in
      </Link>
    </div>
  );
};
