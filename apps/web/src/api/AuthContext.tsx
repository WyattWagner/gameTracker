import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createApiClient } from "./client";

const TOKEN_KEY = "game-tracker-token";

type AuthContextValue = {
  token: string | null;
  setToken: (token: string | null) => void;
  api: ReturnType<typeof createApiClient>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  const setToken = (value: string | null) => {
    setTokenState(value);
    if (value) localStorage.setItem(TOKEN_KEY, value);
    else localStorage.removeItem(TOKEN_KEY);
  };

  const api = useMemo(() => createApiClient(() => token), [token]);

  useEffect(() => {
    if (!token) return;
    api.me().catch(() => setToken(null));
  }, [api, token]);

  return <AuthContext.Provider value={{ token, setToken, api }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
