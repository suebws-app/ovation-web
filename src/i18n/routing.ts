import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  // Middleware would otherwise emit `Link: rel="alternate"; hreflang` for
  // every locale using the current pathname. Blog articles have per-locale
  // slugs, so those pairings point at URLs that don't exist and get Google
  // crawling them. Per-page `alternates.languages` (metadata) + sitemap
  // hreflang are the authoritative source.
  alternateLinks: false,
});
