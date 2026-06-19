"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartShipping } from "./useCartStore";

export type BuyNowItem = Omit<CartItem, "id">;

type BuyNowState = {
  item: BuyNowItem | null;
  shipping: CartShipping | null;
  start: (item: BuyNowItem) => void;
  setShipping: (shipping: CartShipping | null) => void;
  clear: () => void;
};

export const useBuyNowStore = create<BuyNowState>()(
  persist(
    (set) => ({
      item: null,
      shipping: null,
      start: (item) => set({ item, shipping: null }),
      setShipping: (shipping) => set({ shipping }),
      clear: () => set({ item: null, shipping: null }),
    }),
    { name: "ovation_buy_now" },
  ),
);
