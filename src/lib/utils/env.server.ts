import "server-only";

export const serverEnv = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  INTERNAL_API_URL:
    process.env.INTERNAL_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3001",
  MEDIA_DOMAIN: process.env.NEXT_PUBLIC_MEDIA_DOMAIN ?? "",

  SENTRY_DSN: process.env.SENTRY_DSN ?? "",

  DATABASE_URL: process.env.DATABASE_URL ?? "",

  AUTH_COOKIE_SECRET: process.env.AUTH_COOKIE_SECRET ?? "",
  AUTH_HASH_PEPPER: process.env.AUTH_HASH_PEPPER ?? "",

  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  TRUSTED_ORIGINS: (process.env.TRUSTED_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
  APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,

  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  EMAIL_FROM: process.env.EMAIL_FROM ?? "Ovation <hello@ovation.app>",

  PADDLE_CLIENT_TOKEN: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "",
  PADDLE_ENV: (process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox") as
    | "sandbox"
    | "production",

  CF_ORIGIN_TOKEN: process.env.CF_ORIGIN_TOKEN ?? "",

  TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY ?? "",

  COMING_SOON_ENABLED: process.env.COMING_SOON_ENABLED ?? "false",
  COMING_SOON_PASSWORD: process.env.COMING_SOON_PASSWORD ?? "",

  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;
