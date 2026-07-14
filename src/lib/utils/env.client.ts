const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const EMAIL_DOMAIN = process.env.NEXT_PUBLIC_EMAIL_DOMAIN ?? "ovationday.com";
const HELP_URL = (
  process.env.NEXT_PUBLIC_HELP_URL ?? "https://ovation.help"
).replace(/\/$/, "");

export const clientEnv = {
  APP_URL,
  APP_HOST: APP_URL.replace(/^https?:\/\//, "").replace(/\/$/, ""),
  EMAIL_DOMAIN,
  SUPPORT_EMAIL: `support@${EMAIL_DOMAIN}`,
  HELP_URL,
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  MEDIA_DOMAIN: process.env.NEXT_PUBLIC_MEDIA_DOMAIN ?? "",

  PADDLE_CLIENT_TOKEN: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "",
  PADDLE_ENV: (process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox") as
    | "sandbox"
    | "production",

  PEECHO_BUTTON_URL: process.env.NEXT_PUBLIC_PEECHO_BUTTON_URL ?? "",

  TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",

  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",

  POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
  POSTHOG_HOST:
    process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",

  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID ?? "",

  LEGAL_ENTITY_NAME: process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME ?? "Ovation",
  LEGAL_ENTITY_ADDRESS:
    process.env.NEXT_PUBLIC_LEGAL_ENTITY_ADDRESS ?? "Peja, Kosovo",

  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;
