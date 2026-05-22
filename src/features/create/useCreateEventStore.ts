"use client";

import { create } from "zustand";

export type CreateEventFormData = {
  partner1Name: string;
  partner2Name: string;
  displayOrder: string;
  weddingDate: Date | null;
  venue: string;
  coverType: string;
  coverFile: File | null;
  coverFilePreview: string | null;
  bookUrl: string;
};

type CreateEventStore = {
  formData: CreateEventFormData;
  updateFormData: (data: Partial<CreateEventFormData>) => void;
  reset: () => void;
};

const initialFormData: CreateEventFormData = {
  partner1Name: "",
  partner2Name: "",
  displayOrder: "",
  weddingDate: null,
  venue: "",
  coverType: "",
  coverFile: null,
  coverFilePreview: null,
  bookUrl: "",
};

export const useCreateEventStore = create<CreateEventStore>((set) => ({
  formData: initialFormData,
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  reset: () => set({ formData: initialFormData }),
}));
