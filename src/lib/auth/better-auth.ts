import "server-only";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { env } from "@/lib/utils/env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 5,
});

export const auth = betterAuth({
  database: pool,
  baseURL: env.APP_URL,
  trustedOrigins: [env.APP_URL],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24,
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
    },
    apple: {
      clientId: env.APPLE_CLIENT_ID ?? "",
      clientSecret: env.APPLE_CLIENT_SECRET ?? "",
    },
  },

  user: {
    additionalFields: {
      preferredLanguage: {
        type: "string",
        defaultValue: "en",
        required: false,
      },
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
      emailPreferences: {
        type: "string",
        defaultValue: JSON.stringify({
          marketing: false,
          digest: true,
          alerts: true,
        }),
        required: false,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  advanced: {
    cookiePrefix: "ovation",
    crossSubDomainCookies: { enabled: false },
  },

  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
