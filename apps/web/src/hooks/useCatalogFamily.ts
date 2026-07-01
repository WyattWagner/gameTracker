import { useEffect, useState } from "react";
import type { CatalogGameId, GameMonsterDetail, GameMonsterFamily } from "@game-tracker/shared";
import { useAuth } from "../api/AuthContext";

export function useCatalogFamily(monsterName: string, metadataFamilySlug?: string | null) {
  const { api } = useAuth();
  const [family, setFamily] = useState<GameMonsterFamily | null>(null);
  const [details, setDetails] = useState<Partial<Record<CatalogGameId, GameMonsterDetail>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const fam = metadataFamilySlug
          ? await api.getCatalogFamily(metadataFamilySlug)
          : await api.resolveCatalogFamily(monsterName);
        if (cancelled || !fam) return;
        setFamily(fam);
        const entries = await Promise.all(
          fam.games.map(async (g) => {
            const detail = await api.getCatalogMonster(g.monsterId);
            return [g.game, detail] as const;
          }),
        );
        if (cancelled) return;
        const map: Partial<Record<CatalogGameId, GameMonsterDetail>> = {};
        for (const [game, detail] of entries) {
          map[game] = detail;
        }
        setDetails(map);
      } catch {
        if (!cancelled) {
          setFamily(null);
          setDetails({});
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [api, monsterName, metadataFamilySlug]);

  return { family, details, loading };
}
