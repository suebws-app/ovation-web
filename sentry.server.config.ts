import { init } from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  init({
    dsn,
    environment:
      process.env.SENTRY_ENV ?? process.env.NODE_ENV ?? "development",
    tracesSampleRate: 0.025,
  });
}
