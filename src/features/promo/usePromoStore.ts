"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTTLLocalStorage } from "@/lib/storage/ttlStorage";

type PromoStore = {
  code: string | null;
  setCode: (code: string) => void;
  clear: () => void;
};

const STORE_KEY = "ovation_promo_v1";
const TTL_MS = 48 * 60 * 60 * 1000;

const CODE_PATTERN = /^[A-Z0-9_-]{2,40}$/;

export const normalizePromoCode = (
  raw: string | null | undefined,
): string | null => {
  if (!raw) return null;
  const trimmed = raw.trim().toUpperCase();
  return CODE_PATTERN.test(trimmed) ? trimmed : null;
};

export const usePromoStore = create<PromoStore>()(
  persist(
    (set) => ({
      code: null,
      setCode: (code) => {
        const normalized = normalizePromoCode(code);
        if (!normalized) return;
        set({ code: normalized });
      },
      clear: () => {
        set({ code: null });
        usePromoStore.persist.clearStorage();
      },
    }),
    {
      name: STORE_KEY,
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() =>
        createTTLLocalStorage({ ttlMs: TTL_MS }),
      ),
      partialize: (state) => ({ code: state.code }),
    },
  ),
);
