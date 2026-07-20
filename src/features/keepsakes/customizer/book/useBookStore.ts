"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTTLLocalStorage } from "@/lib/storage/ttlStorage";
import type { BookStepId } from "./bookSteps";

type BookStore = {
  step: BookStepId;
  productKey: string | null;
  setStep: (step: BookStepId) => void;
  setProductKey: (productKey: string) => void;
};

const STORE_KEY = "ovation_book_customizer_step_v1";
const TTL_MS = 24 * 60 * 60 * 1000;

export const useBookStore = create<BookStore>()(
  persist(
    (set) => ({
      step: "format",
      productKey: null,
      setStep: (step) => set({ step }),
      setProductKey: (productKey) => set({ productKey }),
    }),
    {
      name: STORE_KEY,
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() =>
        createTTLLocalStorage({ ttlMs: TTL_MS }),
      ),
      partialize: (state) => ({
        step: state.step,
        productKey: state.productKey,
      }),
    },
  ),
);
