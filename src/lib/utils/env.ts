export const env = {
  // Public (available in browser)
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  // Server-side API URL — used by RSC/route handlers to bypass Cloudflare
  // (browser challenge would block server-to-server fetches). Falls back to
  // public API_URL when unset (e.g. local dev).
  INTERNAL_API_URL:
    process.env.INTERNAL_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3001",
  MEDIA_DOMAIN: process.env.NEXT_PUBLIC_MEDIA_DOMAIN ?? "",

  // Server-only
  SENTRY_DSN: process.env.SENTRY_DSN ?? "",

  // Database (server-only)
  DATABASE_URL: process.env.DATABASE_URL ?? "",

  // Auth — two independent secrets (server-only)
  // 1. Cookie HMAC: signs the session cookie. Shared with NestJS for
  //    verification. Rotation requires invalidating all sessions.
  AUTH_COOKIE_SECRET: process.env.AUTH_COOKIE_SECRET ?? "",
  // 2. Hash pepper: HMAC key for IP/UA hashing.
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

  // Email (server-only — used by Better Auth verification emails)
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  EMAIL_FROM: process.env.EMAIL_FROM ?? "Ovation <hello@ovation.app>",

  // Paddle (public — safe to expose in browser)
  PADDLE_CLIENT_TOKEN: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "",
  PADDLE_ENV: (process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox") as
    | "sandbox"
    | "production",

  // Cloudflare origin-pull secret — required by proxy.ts and auth route to
  // reject requests that did not pass through Cloudflare. Enforcement is
  // skipped when unset, making it safe to deploy before the CF rule is live.
  CF_ORIGIN_TOKEN: process.env.CF_ORIGIN_TOKEN ?? "",

  // Cloudflare Turnstile — public site key for the widget.
  // When blank, Turnstile widgets are not rendered.
  TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  // Cloudflare Turnstile — server-side secret used to verify tokens against
  // siteverify. When set, the Better Auth route enforces token validation
  // on sign-up, password-reset and sign-in (after repeated failures).
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY ?? "",

  // Coming soon mode — gates all routes behind a password-protected page.
  // Set COMING_SOON_ENABLED=true and COMING_SOON_PASSWORD=<secret> to enable.
  COMING_SOON_ENABLED: process.env.COMING_SOON_ENABLED ?? "false",
  COMING_SOON_PASSWORD: process.env.COMING_SOON_PASSWORD ?? "",

  // Derived
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;
