import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/seo/urls";

// Private paths that must be disallowed in EVERY locale prefix, not just
// the default. next-intl uses localePrefix "as-needed": default-locale
// URLs are prefix-less (/sign-in), non-default URLs carry the prefix
// (/de/sign-in). Emit both forms so crawlers can't reach private surface
// via a locale prefix.
const PRIVATE_PATHS = [
  "/api/",
  "/monitoring",
  "/coming-soon",
  "/checkout/",
  "/plans",
  "/create/",
  "/verify",
  "/home",
  "/settings",
  "/analytics",
  "/messages",
  "/events",
  "/guests",
  "/gallery",
  "/shop",
  "/orders",
  "/cart",
  "/account",
  "/qr-code",
  "/link",
  "/help",
  "/g/",
  "/i/",
  "/kiosk/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

const disallow = [
  ...PRIVATE_PATHS,
  ...PRIVATE_PATHS.map((path) => `/*${path}`),
];

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow,
    },
  ],
  sitemap: `${appUrl}/sitemap.xml`,
});

export default robots;
