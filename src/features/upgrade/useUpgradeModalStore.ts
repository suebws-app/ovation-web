import { create } from "zustand";

export type UpgradeReason = "messages" | "storage";

type UpgradeModalStore = {
  open: boolean;
  reason: UpgradeReason | null;
  show: (reason: UpgradeReason) => void;
  close: () => void;
};

export const useUpgradeModalStore = create<UpgradeModalStore>((set) => ({
  open: false,
  reason: null,
  show: (reason) => set({ open: true, reason }),
  close: () => set({ open: false, reason: null }),
}));
