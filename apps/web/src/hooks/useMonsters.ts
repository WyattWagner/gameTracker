import { useCallback, useEffect, useState } from "react";
import type { Monster } from "@game-tracker/shared";
import { useAuth } from "../api/AuthContext";

export function useMonsters(gameId = "monster-hunter", search = "") {
  const { api, token } = useAuth();
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ gameId });
      if (search) params.set("search", search);
      const result = await api.listMonsters(`?${params.toString()}`);
      setMonsters(result.monsters);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load monsters");
    } finally {
      setLoading(false);
    }
  }, [api, gameId, search, token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { monsters, loading, error, refresh };
}
