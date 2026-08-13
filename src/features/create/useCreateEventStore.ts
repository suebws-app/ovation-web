"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTTLLocalStorage } from "@/lib/storage/ttlStorage";
import { DEFAULT_EVENT_TYPE, type EventType } from "@/lib/event-types";

export type CreateEventFormData = {
  eventType: EventType;
  partner1Name: string;
  partner2Name: string;
  weddingDate: Date | null;
  endDate: Date | null;
  venueName: string;
  venueCity: string;
  themeColor: string;
  bookUrl: string;
  // Type-specific fields (registry `details` fields) collected by the dynamic
  // form; merged into the event's `details` on create.
  details: Record<string, unknown>;
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
  eventType: DEFAULT_EVENT_TYPE,
  partner1Name: "",
  partner2Name: "",
  weddingDate: null,
  endDate: null,
  venueName: "",
  venueCity: "",
  themeColor: "#FF78AC",
  bookUrl: "",
  details: {},
};

const STORE_KEY = "ovation_create_event_v1";
const TTL_MS = 5 * 60 * 1000;

const dateFieldReviver = (key: string, value: unknown) => {
  if (
    (key === "weddingDate" || key === "endDate") &&
    typeof value === "string"
  ) {
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
      version: 5,
      skipHydration: true,
      storage: createJSONStorage(
        () => createTTLLocalStorage({ ttlMs: TTL_MS }),
        { reviver: dateFieldReviver },
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
        const weddingDate =
          persistedForm.weddingDate instanceof Date &&
          !Number.isNaN(persistedForm.weddingDate.getTime())
            ? persistedForm.weddingDate
            : null;
        const endDate =
          persistedForm.endDate instanceof Date &&
          !Number.isNaN(persistedForm.endDate.getTime())
            ? persistedForm.endDate
            : null;
        return {
          ...current,
          mode: persistedState.mode ?? current.mode,
          eventId: persistedState.eventId ?? current.eventId,
          formData: {
            ...initialFormData,
            ...persistedForm,
            eventType: persistedForm.eventType ?? initialFormData.eventType,
            details: persistedForm.details ?? {},
            weddingDate,
            endDate,
          },
        };
      },
    },
  ),
);
