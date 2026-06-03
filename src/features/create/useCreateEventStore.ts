import { create } from "zustand";

export type CreateEventFormData = {
  partner1Name: string;
  partner2Name: string;
  weddingDate: Date | null;
  venueName: string;
  venueCity: string;
  coverType: string;
  coverFile: File | null;
  coverFilePreview: string | null;
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
  coverFile: null,
  coverFilePreview: null,
  bookUrl: "",
};

export const useCreateEventStore = create<CreateEventStore>((set) => ({
  formData: initialFormData,
  mode: "create",
  eventId: null,
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  setEditTarget: (eventId) => set({ mode: "edit", eventId }),
  reset: () =>
    set({ formData: initialFormData, mode: "create", eventId: null }),
}));
