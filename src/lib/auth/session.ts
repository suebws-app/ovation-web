import "server-only";
import { cache } from "react";
import { apiFetch } from "@/lib/api/server";
import type { User } from "@/lib/api/types";

export type { User };

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const result = await apiFetch<{ user: User }>("/auth/me").catch((err) => {
    console.warn("[auth-debug] getCurrentUser fetch failed", {
      message: err?.message,
      status: err?.status,
      code: err?.code,
    });
    return null;
  });
  console.warn("[auth-debug] getCurrentUser result", {
    hasUser: !!result?.user,
    userId: result?.user?.id,
  });
  return result?.user ?? null;
});
