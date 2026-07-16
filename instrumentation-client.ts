import {
  init,
  addIntegration,
  browserTracingIntegration,
  captureRouterTransitionStart,
  lazyLoadIntegration,
} from "@sentry/nextjs";
import posthog from "posthog-js";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProduction = process.env.NODE_ENV === "production";

if (dsn) {
  init({
    dsn,
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENV ??
      process.env.NODE_ENV ??
      "development",
    tracesSampleRate: 0.025,
    replaysSessionSampleRate: isProduction ? 0.01 : 0,
    replaysOnErrorSampleRate: isProduction ? 0.5 : 0,
    integrations: [browserTracingIntegration()],
    ignoreErrors: [
      "ResizeObserver loop",
      "ResizeObserver loop limit exceeded",
      "Network Error",
      "AbortError",
      /reading 'parentNode'/,
      /evaluating 'b\.parentNode'/,
      "Error when loading integration: replayIntegration",
    ],
  });

  if (isProduction) {
    lazyLoadIntegration("replayIntegration")
      .then((replayIntegration) => addIntegration(replayIntegration()))
      .catch(() => {});
  }
}

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
    defaults: "2025-05-24",
    capture_pageleave: true,
    autocapture: false,
    persistence: "memory",
    person_profiles: "identified_only",
    debug: !isProduction,
  });
}

export const onRouterTransitionStart = captureRouterTransitionStart;
