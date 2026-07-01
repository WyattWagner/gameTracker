import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_PREFERENCES,
  patchPreferences,
  readPreferences,
  type AppPreferences,
  type AppView,
  type DetailTabId,
} from "../lib/preferences";

export function useAppNavigation() {
  const [prefs, setPrefs] = useState<AppPreferences>(() => readPreferences());

  const persist = useCallback((patch: Partial<AppPreferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      patchPreferences(next);
      return next;
    });
  }, []);

  const navigateHome = useCallback(() => {
    persist({ view: "home", selectedMonsterId: null });
  }, [persist]);

  const navigateMonsters = useCallback(() => {
    persist({ view: "monsters", selectedMonsterId: null });
  }, [persist]);

  const openMonster = useCallback(
    (monsterId: string) => {
      persist({ view: "detail", selectedMonsterId: monsterId });
    },
    [persist],
  );

  const goBackFromDetail = useCallback(() => {
    persist({ view: "monsters", selectedMonsterId: null });
  }, [persist]);

  const setDetailTab = useCallback(
    (detailTab: DetailTabId) => {
      persist({ detailTab });
    },
    [persist],
  );

  const updatePrefs = useCallback(
    (patch: Partial<AppPreferences>) => {
      persist(patch);
    },
    [persist],
  );

  const resetInvalidMonster = useCallback(() => {
    persist({ view: "monsters", selectedMonsterId: null });
  }, [persist]);

  return useMemo(
    () => ({
      prefs,
      view: prefs.view,
      selectedMonsterId: prefs.selectedMonsterId,
      navigateHome,
      navigateMonsters,
      openMonster,
      goBackFromDetail,
      setDetailTab,
      updatePrefs,
      resetInvalidMonster,
      defaults: DEFAULT_PREFERENCES,
    }),
    [
      prefs,
      navigateHome,
      navigateMonsters,
      openMonster,
      goBackFromDetail,
      setDetailTab,
      updatePrefs,
      resetInvalidMonster,
    ],
  );
}

export type AppNavigation = ReturnType<typeof useAppNavigation>;

/** Debounce preference writes for text fields */
export function useDebouncedPref<T extends string>(
  value: T,
  onChange: (v: T) => void,
  delayMs = 300,
): [T, (v: T) => void] {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (local !== value) onChange(local);
    }, delayMs);
    return () => clearTimeout(t);
  }, [local, value, onChange, delayMs]);
  return [local, setLocal];
}
