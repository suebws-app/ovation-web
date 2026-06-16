import { create } from "zustand";

export type ToastKind = "success" | "error" | "info";

export type ToastItem = {
  id: number;
  kind: ToastKind;
  message: string;
  durationMs: number;
};

type ToastStore = {
  toasts: ToastItem[];
  push: (input: {
    kind: ToastKind;
    message: string;
    durationMs?: number;
  }) => void;
  dismiss: (id: number) => void;
};

let nextId = 1;

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: ({ kind, message, durationMs = 4000 }) => {
    const id = nextId++;
    set((state) => ({
      toasts: [...state.toasts, { id, kind, message, durationMs }],
    }));
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const useToasts = () => useToastStore((s) => s.toasts);
export const useDismissToast = () => useToastStore((s) => s.dismiss);

export const toast = {
  success: (message: string, durationMs?: number) =>
    useToastStore.getState().push({ kind: "success", message, durationMs }),
  error: (message: string, durationMs?: number) =>
    useToastStore.getState().push({ kind: "error", message, durationMs }),
  info: (message: string, durationMs?: number) =>
    useToastStore.getState().push({ kind: "info", message, durationMs }),
};
