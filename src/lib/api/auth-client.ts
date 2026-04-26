import { clientFetch } from "./client";
import type { UpdateProfileInput, User } from "./types";

export const authClient = {
  updateProfile: (input: UpdateProfileInput) =>
    clientFetch<{ user: User }>("/auth/me", {
      method: "PATCH",
      body: input,
    }),

  deleteAccount: () =>
    clientFetch<{ message: string }>("/auth/me", { method: "DELETE" }),

  signIn: (input: { email: string; password: string }) =>
    fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),

  signUp: (input: { email: string; password: string; fullName?: string }) =>
    clientFetch<{ message: string }>("/auth/signup", {
      method: "POST",
      body: input,
    }),

  magicLink: (input: { email: string }) =>
    clientFetch<{ message: string }>("/auth/magic-link", {
      method: "POST",
      body: input,
    }),

  forgotPassword: (input: { email: string }) =>
    clientFetch<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: input,
    }),

  resetPassword: (input: { accessToken: string; newPassword: string }) =>
    clientFetch<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: input,
    }),

  verifyEmail: (input: {
    tokenHash: string;
    type?: "email" | "email_change";
  }) =>
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),

  oauthUrl: (input: { provider: "google" | "apple"; redirectTo: string }) =>
    clientFetch<{ url: string }>("/auth/oauth/url", {
      method: "POST",
      body: input,
    }),

  oauthCallback: (input: { code: string }) =>
    fetch("/api/auth/oauth/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),

  signOut: () => fetch("/api/auth/signout", { method: "POST" }),

  refresh: () => fetch("/api/auth/refresh", { method: "POST" }),
};
