"use client";

import { createAuthClient } from "better-auth/react";
import { clientEnv as env } from "@/lib/utils/env.client";

export const authClient = createAuthClient({
  baseURL: env.APP_URL,
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
