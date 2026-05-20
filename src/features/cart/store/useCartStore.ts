"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productSku: string;
  productNameKey: string;
  productSubtitleKey: string | null;
  productKind: string;
  productSlug: string;
  productVariantId: string | null;
  variantName: string | null;
  unitPriceCents: number;
  currency: string;
  quantity: number;
  customization: Record<string, unknown>;
  photoIds: string[];
  timelineDays: string | null;
  requiresShipping: boolean;
  eventId: string;
};

export type CartShipping = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
};

type CartState = {
  items: CartItem[];
  shipping: CartShipping | null;
  promoCode: string | null;
  add: (item: Omit<CartItem, "id">) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  setShipping: (shipping: CartShipping | null) => void;
  setPromoCode: (code: string | null) => void;
  clear: () => void;
  itemCount: () => number;
  subtotalCents: () => number;
  requiresShipping: () => boolean;
};

const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `cart_${Date.now()}_${Math.random().toString(36).slice(2)}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shipping: null,
      promoCode: null,
      add: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, id: generateId() }],
        })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        })),
      increment: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        })),
      decrement: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i,
          ),
        })),
      setShipping: (shipping) => set({ shipping }),
      setPromoCode: (promoCode) => set({ promoCode }),
      clear: () => set({ items: [], shipping: null, promoCode: null }),
      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotalCents: () =>
        get().items.reduce(
          (sum, item) => sum + item.unitPriceCents * item.quantity,
          0,
        ),
      requiresShipping: () => get().items.some((i) => i.requiresShipping),
    }),
    { name: "ovation_cart" },
  ),
);

export const VAT_RATE = 0.1;
export const FREE_SHIPPING_THRESHOLD_CENTS = 10000;

export const calculateVatCents = (subtotalCents: number): number =>
  Math.round(subtotalCents * VAT_RATE);

export const isEligibleForFreeShipping = (subtotalCents: number): boolean =>
  subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
