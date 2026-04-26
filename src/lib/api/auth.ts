import { apiFetch } from "./server";
import type { User, UpdateProfileInput } from "./types";

export const authApi = {
  me: () => apiFetch<{ user: User }>("/auth/me"),

  updateProfile: (input: UpdateProfileInput) =>
    apiFetch<{ user: User }>("/auth/me", { method: "PATCH", body: input }),

  deleteAccount: () =>
    apiFetch<{ message: string }>("/auth/me", { method: "DELETE" }),
};
