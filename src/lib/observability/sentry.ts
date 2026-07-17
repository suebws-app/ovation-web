import type * as SentrySdk from "@sentry/nextjs";
import { locales } from "@/i18n/config";

type SentryModule = typeof SentrySdk;
type CaptureContext = Parameters<SentryModule["captureException"]>[1];
type NavigationType = Parameters<
  SentryModule["captureRouterTransitionStart"]
>[1];

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProduction = process.env.NODE_ENV === "production";

const IDLE_FALLBACK_DELAY_MS = 4000;
const INTERACTION_EVENTS: (keyof WindowEventMap)[] = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
];

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

const maybeLoadReplay = (sentry: SentryModule, pathname: string) => {
  if (!isProduction || replayRequested) return;
  if (!shouldLoadReplay(pathname)) return;
  replayRequested = true;

  const loadReplay = () => {
    sentry
      .lazyLoadIntegration("replayIntegration")
      .then((replayIntegration) => sentry.addIntegration(replayIntegration()))
      .catch(() => {});
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadReplay, { timeout: 10_000 });
  } else {
    setTimeout(loadReplay, 5_000);
  }
};

const queuedEarlyErrors: unknown[] = [];
let sentryPromise: Promise<SentryModule> | null = null;

const onWindowError = (event: ErrorEvent) => {
  queuedEarlyErrors.push(event.error ?? event.message);
  void loadSentry();
};

const onUnhandledRejection = (event: PromiseRejectionEvent) => {
  queuedEarlyErrors.push(event.reason);
  void loadSentry();
};

const removeEarlyErrorListeners = () => {
  window.removeEventListener("error", onWindowError);
  window.removeEventListener("unhandledrejection", onUnhandledRejection);
};

const initSentry = (sentry: SentryModule): SentryModule => {
  sentry.init({
    dsn,
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENV ??
      process.env.NODE_ENV ??
      "development",
    tracesSampleRate: 0.025,
    replaysSessionSampleRate: isProduction ? 0.01 : 0,
    replaysOnErrorSampleRate: isProduction ? 0.5 : 0,
    integrations: [sentry.browserTracingIntegration()],
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

  removeEarlyErrorListeners();
  queuedEarlyErrors
    .splice(0)
    .forEach((error) => sentry.captureException(error));
  maybeLoadReplay(sentry, window.location.pathname);
  return sentry;
};

export const loadSentry = (): Promise<SentryModule> | null => {
  if (!dsn || typeof window === "undefined") return null;
  sentryPromise ??= import("@sentry/nextjs").then(initSentry);
  return sentryPromise;
};

export const scheduleSentryLoad = () => {
  if (!dsn || typeof window === "undefined") return;

  window.addEventListener("error", onWindowError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);

  const cleanups: (() => void)[] = [];
  const runCleanups = () => cleanups.forEach((cleanup) => cleanup());

  const load = () => {
    runCleanups();
    void loadSentry();
  };

  INTERACTION_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, load, { once: true, passive: true });
    cleanups.push(() => window.removeEventListener(eventName, load));
  });

  const timer = window.setTimeout(load, IDLE_FALLBACK_DELAY_MS);
  cleanups.push(() => window.clearTimeout(timer));
};

export const trackRouterTransition = (
  href: string,
  navigationType: NavigationType,
) => {
  void loadSentry()?.then((sentry) => {
    maybeLoadReplay(sentry, new URL(href, window.location.origin).pathname);
    sentry.captureRouterTransitionStart(href, navigationType);
  });
};

export const captureMonitoredException = (
  error: unknown,
  context?: CaptureContext,
) => {
  if (typeof window === "undefined") {
    void import("@sentry/nextjs")
      .then((sentry) => sentry.captureException(error, context))
      .catch(() => {});
    return;
  }
  void loadSentry()?.then((sentry) => sentry.captureException(error, context));
};
