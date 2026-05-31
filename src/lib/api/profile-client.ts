import { clientFetch } from "./client";
import type { UpdateProfileInput, User } from "./types";

export const profileClient = {
  updateProfile: (input: UpdateProfileInput) =>
    clientFetch<{ user: User }>("/auth/me", {
      method: "PATCH",
      body: input,
    }),

  deleteAccount: () =>
    clientFetch<{ message: string }>("/auth/me", { method: "DELETE" }),

  markOnboardingComplete: () =>
    clientFetch<void>("/auth/me/onboarding-complete", { method: "POST" }),
};
