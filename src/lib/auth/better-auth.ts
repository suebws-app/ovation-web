import "server-only";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { env } from "@/lib/utils/env";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "./email-sender";

if (env.IS_PRODUCTION && !env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET must be set in production");
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.IS_PRODUCTION ? 20 : 5,
});

const userLocale = (user: unknown): string => {
  const u = user as { preferredLanguage?: string | null };
  return u.preferredLanguage ?? "en";
};

export const auth = betterAuth({
  database: pool,
  baseURL: env.APP_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: env.TRUSTED_ORIGINS,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url, userLocale(user));
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, url, userLocale(user));
    },
  },

  socialProviders: {
    google: env.GOOGLE_CLIENT_ID
      ? {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
        }
      : undefined,
    apple: env.APPLE_CLIENT_ID
      ? {
          clientId: env.APPLE_CLIENT_ID,
          clientSecret: env.APPLE_CLIENT_SECRET ?? "",
        }
      : undefined,
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  user: {
    modelName: "users",
    fields: {
      name: "full_name",
      image: "avatar_url",
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    additionalFields: {
      preferredLanguage: {
        type: "string",
        defaultValue: "en",
        required: false,
        fieldName: "preferred_language",
      },
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
        fieldName: "role",
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
  },

  advanced: {
    cookiePrefix: "ovation",
    crossSubDomainCookies: { enabled: false },
  },

  plugins: [
    jwt({
      jwt: {
        expirationTime: "10m",
        issuer: env.APP_URL,
        audience: "ovation-api",
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
