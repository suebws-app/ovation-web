import "server-only";
import { cache } from "react";
import { ApiError } from "@/lib/api/client";
import { authApi } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";

export type { User };

export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    const { user } = await authApi.me();
    return user;
  } catch (error) {
    if (ApiError.isApiError(error) && error.status === 401) {
      return null;
    }
    throw error;
  }
});
