export const clientEnv = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  MEDIA_DOMAIN: process.env.NEXT_PUBLIC_MEDIA_DOMAIN ?? "",

  PADDLE_CLIENT_TOKEN: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "",
  PADDLE_ENV: (process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox") as
    | "sandbox"
    | "production",

  TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",

  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;
