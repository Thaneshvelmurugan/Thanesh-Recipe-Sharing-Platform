import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AuthPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form, mode);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 rounded-[2rem] bg-white p-8 shadow-soft lg:grid-cols-[1fr_0.9fr] lg:p-12">
        <div className="rounded-[2rem] bg-ink p-8 text-white">
          <p className="text-sm uppercase tracking-[0.25em] text-apricot">Welcome back to the kitchen</p>
          <h1 className="mt-4 font-display text-5xl">Sign in, post recipes, and plan your week in one place.</h1>
          <p className="mt-6 max-w-md text-white/75">
            Demo seed accounts after seeding the database: `maya@example.com` and `ethan@example.com`, password
            `password123`.
          </p>
        </div>
        <form onSubmit={submitHandler} className="space-y-5">
          <div className="flex gap-2 rounded-full bg-sand p-2">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-full px-4 py-3 ${mode === "login" ? "bg-ink text-white" : "text-ink/70"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-full px-4 py-3 ${mode === "register" ? "bg-ink text-white" : "text-ink/70"}`}
            >
              Register
            </button>
          </div>

          {mode === "register" && (
            <input
              required
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Full name"
              className="w-full rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
            />
          )}
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Email"
            className="w-full rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
          />
          <input
            required
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Password"
            className="w-full rounded-2xl border border-stone-200 bg-sand px-4 py-3 outline-none focus:border-clay"
          />

          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={loading} className="w-full rounded-full bg-clay px-6 py-3 text-white">
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create account"}
          </button>
        </form>
      </div>
    </section>
  );
};
