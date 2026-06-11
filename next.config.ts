import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const mediaDomain = process.env.NEXT_PUBLIC_MEDIA_DOMAIN ?? "";
const objectStorageDomain = process.env.OBJECT_STORAGE_PUBLIC_DOMAIN ?? "";
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const isDev = process.env.NODE_ENV === "development";

const scriptSrc = [
  "'self'",
  "https://static.cloudflareinsights.com",
  "https://challenges.cloudflare.com",
  "https://*.paddle.com",
  "https://*.paddle.dev",
  isDev ? "'unsafe-eval'" : "",
  isDev ? "'unsafe-inline'" : "",
]
  .filter(Boolean)
  .join(" ");

const frameSrc = [
  "'self'",
  "https://challenges.cloudflare.com",
  "https://*.paddle.com",
  "https://*.paddle.dev",
  objectStorageDomain,
  "https://*.r2.cloudflarestorage.com",
  isDev ? "http://localhost:9000" : "",
]
  .filter(Boolean)
  .join(" ");

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

const remotePatterns: RemotePattern[] = [
  { protocol: "https", hostname: "lh3.googleusercontent.com" },
  { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
];

if (isDev) {
  remotePatterns.push(
    { protocol: "http", hostname: "localhost", pathname: "/**" },
    { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
  );
}

if (mediaDomain) {
  try {
    const { hostname, protocol, port } = new URL(
      mediaDomain.startsWith("http") ? mediaDomain : `https://${mediaDomain}`,
    );
    remotePatterns.push({
      protocol: protocol.replace(":", "") as "https" | "http",
      hostname,
      port: port || "",
      pathname: "**",
    });
  } catch {
    // invalid NEXT_PUBLIC_MEDIA_DOMAIN — no remote pattern added for media
  }
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(self), microphone=(self), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: ${mediaDomain} ${objectStorageDomain} https://*.r2.cloudflarestorage.com https://lh3.googleusercontent.com https://*.paddle.com`,
      `media-src 'self' blob: data: ${mediaDomain} ${objectStorageDomain} https://*.r2.cloudflarestorage.com`,
      `connect-src 'self' ${apiUrl} ${appUrl} ${mediaDomain} ${objectStorageDomain} https://*.r2.cloudflarestorage.com https://challenges.cloudflare.com https://*.paddle.com https://*.paddle.dev`,
      `frame-src ${frameSrc}`,
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  transpilePackages: ["@ovation/ui", "@ovation/icons"],
  allowedDevOrigins,
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
