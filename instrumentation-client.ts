import {
  init,
  browserTracingIntegration,
  captureRouterTransitionStart,
  lazyLoadIntegration,
} from "@sentry/nextjs";

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
    ],
  });

  if (isProduction) {
    void lazyLoadIntegration("replayIntegration");
  }
}

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (posthogKey && isProduction) {
  void import("posthog-js").then(({ default: posthog }) => {
    posthog.init(posthogKey, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      persistence: "memory",
      autocapture: false,
    });
  });
}

export const onRouterTransitionStart = captureRouterTransitionStart;
