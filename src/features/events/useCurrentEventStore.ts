"use client";

import { create } from "zustand";

type CurrentEventStore = {
  label: string | null;
  setLabel: (label: string) => void;
  clearLabel: () => void;
};

export const useCurrentEventStore = create<CurrentEventStore>((set) => ({
  label: null,
  setLabel: (label) => set({ label }),
  clearLabel: () => set({ label: null }),
}));
