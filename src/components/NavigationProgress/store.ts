import { create } from "zustand";

type NavProgressStore = {
  pending: boolean;
  start: () => void;
  end: () => void;
};

export const useNavProgressStore = create<NavProgressStore>((set) => ({
  pending: false,
  start: () => set({ pending: true }),
  end: () => set({ pending: false }),
}));

export const startNavigation = (): void => {
  useNavProgressStore.getState().start();
};
