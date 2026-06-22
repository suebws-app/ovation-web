import { create } from "zustand";

const ACTIVATION_TTL_SECONDS = 120;
export const ACTIVATING_COOKIE_NAME = "ovation_plan_activating";

const writeCookie = (orderId: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${ACTIVATING_COOKIE_NAME}=${encodeURIComponent(orderId)}; Max-Age=${ACTIVATION_TTL_SECONDS}; Path=/; SameSite=Lax`;
};

const eraseCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${ACTIVATING_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
};

type OptimisticPlanStore = {
  activatingOrderId: string | null;
  markActivating: (orderId: string) => void;
  clear: () => void;
};

let expiryTimer: ReturnType<typeof setTimeout> | null = null;

export const useOptimisticPlanStore = create<OptimisticPlanStore>((set) => ({
  activatingOrderId: null,
  markActivating: (orderId) => {
    if (expiryTimer) clearTimeout(expiryTimer);
    writeCookie(orderId);
    set({ activatingOrderId: orderId });
    expiryTimer = setTimeout(() => {
      expiryTimer = null;
      eraseCookie();
      set({ activatingOrderId: null });
    }, ACTIVATION_TTL_SECONDS * 1000);
  },
  clear: () => {
    if (expiryTimer) {
      clearTimeout(expiryTimer);
      expiryTimer = null;
    }
    eraseCookie();
    set({ activatingOrderId: null });
  },
}));
