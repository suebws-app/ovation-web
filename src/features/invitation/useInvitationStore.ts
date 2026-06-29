"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTTLLocalStorage } from "@/lib/storage/ttlStorage";
import type { InvitationStepId } from "./constants";

type InvitationStore = {
  step: InvitationStepId;
  setStep: (step: InvitationStepId) => void;
};

const STORE_KEY = "ovation_invitation_step_v1";
const TTL_MS = 24 * 60 * 60 * 1000;

export const useInvitationStore = create<InvitationStore>()(
  persist(
    (set) => ({
      step: "design",
      setStep: (step) => set({ step }),
    }),
    {
      name: STORE_KEY,
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() =>
        createTTLLocalStorage({ ttlMs: TTL_MS }),
      ),
      partialize: (state) => ({ step: state.step }),
    },
  ),
);
