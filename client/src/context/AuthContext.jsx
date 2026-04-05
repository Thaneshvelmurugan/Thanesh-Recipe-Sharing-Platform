import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("recipe_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("recipe_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("recipe_token", token);
    } else {
      localStorage.removeItem("recipe_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("recipe_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("recipe_user");
    }
  }, [user]);

  const login = async (credentials, mode = "login") => {
    setLoading(true);
    try {
      const data = await api.post(`/auth/${mode}`, credentials);
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const refreshMe = async () => {
    if (!token) return null;
    const data = await api.get("/auth/me", token);
    setUser({
      id: data._id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      bio: data.bio,
      dietaryPreferences: data.dietaryPreferences,
      followersCount: data.followers?.length || 0,
      followingCount: data.following?.length || 0
    });
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loading,
      login,
      logout,
      refreshMe,
      setUser
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
