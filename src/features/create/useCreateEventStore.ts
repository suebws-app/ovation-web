"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTTLLocalStorage } from "@/lib/storage/ttlStorage";

export type CreateEventFormData = {
  partner1Name: string;
  partner2Name: string;
  weddingDate: Date | null;
  venueName: string;
  venueCity: string;
  coverType: string;
  bookUrl: string;
};

export type CreateEventMode = "create" | "edit";

type CreateEventStore = {
  formData: CreateEventFormData;
  mode: CreateEventMode;
  eventId: string | null;
  updateFormData: (data: Partial<CreateEventFormData>) => void;
  setEditTarget: (eventId: string) => void;
  reset: () => void;
};

const initialFormData: CreateEventFormData = {
  partner1Name: "",
  partner2Name: "",
  weddingDate: null,
  venueName: "",
  venueCity: "",
  coverType: "",
  bookUrl: "",
};

const STORE_KEY = "ovation_create_event_v1";
const TTL_MS = 5 * 60 * 1000;

const weddingDateReviver = (key: string, value: unknown) => {
  if (key === "weddingDate" && typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return value;
};

type PersistedFormData = CreateEventFormData;
type PersistedState = {
  formData: PersistedFormData;
  mode: CreateEventMode;
  eventId: string | null;
};

export const useCreateEventStore = create<CreateEventStore>()(
  persist(
    (set) => ({
      formData: initialFormData,
      mode: "create",
      eventId: null,
      updateFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      setEditTarget: (eventId) => set({ mode: "edit", eventId }),
      reset: () => {
        set({ formData: initialFormData, mode: "create", eventId: null });
        useCreateEventStore.persist.clearStorage();
      },
    }),
    {
      name: STORE_KEY,
      version: 2,
      skipHydration: true,
      storage: createJSONStorage(
        () => createTTLLocalStorage({ ttlMs: TTL_MS }),
        { reviver: weddingDateReviver },
      ),
      partialize: (state): PersistedState => ({
        formData: state.formData,
        mode: state.mode,
        eventId: state.eventId,
      }),
      merge: (persisted, current) => {
        const persistedState = (persisted ?? {}) as Partial<PersistedState>;
        const persistedForm = (persistedState.formData ??
          {}) as Partial<PersistedFormData>;
        const coverType =
          persistedForm.coverType === "upload"
            ? ""
            : (persistedForm.coverType ?? initialFormData.coverType);
        const weddingDate =
          persistedForm.weddingDate instanceof Date &&
          !Number.isNaN(persistedForm.weddingDate.getTime())
            ? persistedForm.weddingDate
            : null;
        return {
          ...current,
          mode: persistedState.mode ?? current.mode,
          eventId: persistedState.eventId ?? current.eventId,
          formData: {
            ...initialFormData,
            ...persistedForm,
            weddingDate,
            coverType,
          },
        };
      },
    },
  ),
);
