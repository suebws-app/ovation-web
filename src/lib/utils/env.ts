export const env = {
  // Public (available in browser)
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",

  // Server-only
  API_URL_INTERNAL: process.env.API_URL ?? "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
  SENTRY_DSN: process.env.SENTRY_DSN ?? "",

  // Database (server-only)
  DATABASE_URL: process.env.DATABASE_URL ?? "",

  // Better Auth secret + OAuth providers (server-only)
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
  APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,

  // Email (server-only — used by Better Auth verification emails)
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  EMAIL_FROM: process.env.EMAIL_FROM ?? "Ovation <hello@ovation.app>",

  // Derived
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;
