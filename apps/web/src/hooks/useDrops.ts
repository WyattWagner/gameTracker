import { useCallback, useEffect, useState } from "react";
import type { Drop } from "@game-tracker/shared";
import { useAuth } from "../api/AuthContext";

export function useDrops(gameId = "monster-hunter", sourceMonsterId?: string) {
  const { api, token } = useAuth();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ gameId });
      if (sourceMonsterId) params.set("sourceMonsterId", sourceMonsterId);
      const result = await api.listDrops(`?${params.toString()}`);
      setDrops(result.drops);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drops");
    } finally {
      setLoading(false);
    }
  }, [api, gameId, sourceMonsterId, token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { drops, loading, error, refresh };
}
