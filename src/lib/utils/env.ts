export const env = {
  // Public (available in browser)
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',

  // Server-only
  API_URL_INTERNAL: process.env.API_URL ?? '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
  SENTRY_DSN: process.env.SENTRY_DSN ?? '',

  // Derived
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const
