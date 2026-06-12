import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const mediaDomain = process.env.NEXT_PUBLIC_MEDIA_DOMAIN ?? "";
const isDev = process.env.NODE_ENV === "development";

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
