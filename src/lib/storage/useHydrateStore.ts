"use client";

import { useEffect, useState } from "react";

type PersistedStore = {
  persist: {
    rehydrate: () => Promise<void> | void;
    hasHydrated: () => boolean;
  };
};

export const useHydrateStore = <T extends PersistedStore>(
  store: T,
): boolean => {
  const [hydrated, setHydrated] = useState<boolean>(() =>
    store.persist.hasHydrated(),
  );

  useEffect(() => {
    if (hydrated) return;
    let cancelled = false;
    Promise.resolve(store.persist.rehydrate()).then(() => {
      if (!cancelled) setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, store]);

  return hydrated;
};
