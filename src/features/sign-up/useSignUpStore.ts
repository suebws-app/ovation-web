"use client";

import { create } from "zustand";

export type SignUpFormData = {
  email: string;
  password: string;
  agreedToTerms: boolean;
  accountType: "couple" | "pro" | "";
  businessName: string;
  selectedPlan: string;
};

type SignUpStore = {
  formData: SignUpFormData;
  updateFormData: (data: Partial<SignUpFormData>) => void;
  reset: () => void;
};

const initialFormData: SignUpFormData = {
  email: "",
  password: "",
  agreedToTerms: false,
  accountType: "",
  businessName: "",
  selectedPlan: "",
};

export const useSignUpStore = create<SignUpStore>((set) => ({
  formData: initialFormData,
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  reset: () => set({ formData: initialFormData }),
}));
