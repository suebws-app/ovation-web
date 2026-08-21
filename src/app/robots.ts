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
  "/checkout/",
  "/create/",
  "/verify",
  "/verify-email",
  "/home",
  "/settings/",
  "/analytics",
  "/messages/",
  "/events/",
  "/guests",
  "/gallery",
  "/shop",
  "/orders",
  "/cart",
  "/account",
  "/qr-code",
  "/link",
  "/g/",
  "/i/",
  "/kiosk/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

const localePrefixedPaths = (paths: string[], localePattern: string) =>
  paths.map((path) => `/${localePattern}${path}`);

const ALLOWED_LOCALIZATION = process.env.NEXT_PUBLIC_ALLOWED_LOCALIZATION ?? "";
const NON_DEFAULT_LOCALES = ALLOWED_LOCALIZATION.split(",")
  .map((token) => token.trim())
  .filter(Boolean)
  .slice(1);

const disallow = [
  ...PRIVATE_PATHS,
  ...NON_DEFAULT_LOCALES.flatMap((locale) =>
    localePrefixedPaths(PRIVATE_PATHS, locale),
  ),
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
