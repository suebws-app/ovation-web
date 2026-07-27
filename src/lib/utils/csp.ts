import "server-only";

import { themeInitScriptHash } from "./themeInitScript";

const isDev = process.env.NODE_ENV === "development";
const mediaDomain = process.env.NEXT_PUBLIC_MEDIA_DOMAIN ?? "";
const objectStorageDomain = process.env.OBJECT_STORAGE_PUBLIC_DOMAIN ?? "";
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const peechoScriptOrigin = (() => {
  const url = process.env.NEXT_PUBLIC_PEECHO_BUTTON_URL ?? "";
  try {
    return url ? new URL(url).origin : "";
  } catch {
    return "";
  }
})();

const frameSrc = [
  "'self'",
  "https://challenges.cloudflare.com",
  "https://*.paddle.com",
  "https://*.paddle.dev",
  objectStorageDomain,
  "https://*.r2.cloudflarestorage.com",
  "https://va.vercel-scripts.com",
  "https://client.crisp.chat",
  isDev ? "http://localhost:9000" : "",
]
  .filter(Boolean)
  .join(" ");

const laxScriptSrc = [
  "'self'",
  "https://cdn-cookieyes.com",
  "https://static.cloudflareinsights.com",
  "https://challenges.cloudflare.com",
  "https://va.vercel-scripts.com",
  "https://*.paddle.com",
  "https://*.paddle.dev",
  "https://*.i.posthog.com",
  "https://*.posthog.com",
  "https://browser.sentry-cdn.com",
  "https://*.sentry-cdn.com",
  "https://*.googletagmanager.com",
  "https://client.crisp.chat",
  peechoScriptOrigin,
  "'unsafe-inline'",
  isDev ? "'unsafe-eval'" : "",
]
  .filter(Boolean)
  .join(" ");

const strictScriptSrc = (nonce: string): string =>
  [
    `'nonce-${nonce}'`,
    `'${themeInitScriptHash}'`,
    "'strict-dynamic'",
    "'unsafe-inline'",
    "https:",
    isDev ? "'unsafe-eval'" : "",
  ]
    .filter(Boolean)
    .join(" ");

export const buildCsp = (nonce?: string): string =>
  [
    "default-src 'self'",
    `script-src ${nonce ? strictScriptSrc(nonce) : laxScriptSrc}`,
    `style-src 'self' 'unsafe-inline' ${peechoScriptOrigin} https://client.crisp.chat`.trim(),
    `img-src 'self' data: blob: ${mediaDomain} ${objectStorageDomain} https://cdn-cookieyes.com https://*.r2.cloudflarestorage.com https://*.r2.dev https://lh3.googleusercontent.com https://*.paddle.com https://*.googletagmanager.com https://*.google-analytics.com https://client.crisp.chat https://image.crisp.chat https://storage.crisp.chat`,
    `media-src 'self' blob: data: ${mediaDomain} ${objectStorageDomain} https://*.r2.cloudflarestorage.com https://*.r2.dev https://client.crisp.chat`,
    `connect-src 'self' ${apiUrl} ${appUrl} ${mediaDomain} ${objectStorageDomain} https://cdn-cookieyes.com https://*.cookieyes.com https://*.r2.cloudflarestorage.com https://challenges.cloudflare.com https://*.paddle.com https://*.paddle.dev https://browser.sentry-cdn.com https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.i.posthog.com https://*.posthog.com https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://client.crisp.chat https://storage.crisp.chat wss://client.relay.crisp.chat wss://stream.relay.crisp.chat`,
    `frame-src ${frameSrc}`,
    "font-src 'self' https://client.crisp.chat",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self' https://*.peecho.com",
    "upgrade-insecure-requests",
  ].join("; ");
