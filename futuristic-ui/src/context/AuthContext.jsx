import { createContext, useContext, useEffect, useMemo, useState } from "react";
import jwtDecode from "jwt-decode";
import api, { tokenStore } from "@/lib/apiClient";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const persisted = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("auth") || "null") : null;
    if (persisted?.accessToken && persisted?.refreshToken) {
      tokenStore.setTokens({ access: persisted.accessToken, refresh: persisted.refreshToken });
      try {
        const decoded = jwtDecode(persisted.accessToken);
        setUser({ id: decoded.sub, email: decoded.email, role: decoded.role || "user" });
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    tokenStore.setTokens({ access: data.accessToken, refresh: data.refreshToken });
    const decoded = jwtDecode(data.accessToken);
    const profile = { id: decoded.sub, email: decoded.email, role: decoded.role || "user" };
    setUser(profile);
    localStorage.setItem("auth", JSON.stringify({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
    return profile;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    tokenStore.setTokens({ access: data.accessToken, refresh: data.refreshToken });
    const decoded = jwtDecode(data.accessToken);
    const profile = { id: decoded.sub, email: decoded.email, role: decoded.role || "user" };
    setUser(profile);
    localStorage.setItem("auth", JSON.stringify({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
    return profile;
  };

  const logout = async () => {
    try { await api.post("/auth/logout", { refreshToken: tokenStore.refresh }); } catch {}
    tokenStore.clear();
    setUser(null);
    localStorage.removeItem("auth");
  };

  const hasRole = (roles) => (Array.isArray(roles) ? roles.includes(user?.role) : user?.role === roles);

  const value = useMemo(() => ({ user, loading, login, signup, logout, hasRole }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}