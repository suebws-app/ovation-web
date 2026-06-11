import "server-only";
import { cache } from "react";
import { apiFetch } from "@/lib/api/server";
import type { User } from "@/lib/api/types";

export type { User };

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const result = await apiFetch<{ user: User }>("/auth/me").catch(() => null);
  return result?.user ?? null;
});
