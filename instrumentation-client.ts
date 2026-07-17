import {
  init,
  addIntegration,
  browserTracingIntegration,
  captureRouterTransitionStart,
  lazyLoadIntegration,
} from "@sentry/nextjs";
import { locales } from "@/i18n/config";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProduction = process.env.NODE_ENV === "production";

const REPLAY_BLOCKED_EXACT = new Set([
  "/",
  "/about",
  "/careers",
  "/changelog",
  "/contact",
  "/for-planners",
  "/gold-book",
  "/how-it-works",
  "/keepsakes",
  "/pricing",
  "/sample",
  "/sustainability",
  "/coming-soon",
]);
const REPLAY_BLOCKED_PREFIXES = [
  "/legal",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

const stripLocalePrefix = (pathname: string): string => {
  const [, first, ...rest] = pathname.split("/");
  if (first && (locales as readonly string[]).includes(first)) {
    return `/${rest.join("/")}`;
  }
  return pathname;
};

const shouldLoadReplay = (pathname: string): boolean => {
  const path = stripLocalePrefix(pathname);
  const normalized =
    path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
  if (REPLAY_BLOCKED_EXACT.has(normalized)) return false;
  return !REPLAY_BLOCKED_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
};

let replayRequested = false;

const maybeLoadReplay = (pathname: string) => {
  if (!dsn || !isProduction || replayRequested) return;
  if (!shouldLoadReplay(pathname)) return;
  replayRequested = true;

  const loadReplay = () => {
    lazyLoadIntegration("replayIntegration")
      .then((replayIntegration) => addIntegration(replayIntegration()))
      .catch(() => {});
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadReplay, { timeout: 10_000 });
  } else {
    setTimeout(loadReplay, 5_000);
  }
};

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

  maybeLoadReplay(window.location.pathname);
}

export const onRouterTransitionStart: typeof captureRouterTransitionStart = (
  href,
  navigationType,
) => {
  maybeLoadReplay(new URL(href, window.location.origin).pathname);
  return captureRouterTransitionStart(href, navigationType);
};
