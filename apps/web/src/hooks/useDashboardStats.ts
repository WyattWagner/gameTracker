import { useCallback, useEffect, useState } from "react";
import type { DashboardStats } from "@game-tracker/shared";
import { useAuth } from "../api/AuthContext";

export function useDashboardStats(gameId = "monster-hunter") {
  const { api, token } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const stats = await api.dashboardStats(`?gameId=${encodeURIComponent(gameId)}`);
      setData(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [api, gameId, token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
