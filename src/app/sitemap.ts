import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { absoluteUrl, localizePath } from "@/lib/seo/urls";

type MarketingRoute = {
  path: string;
  priority: number;
};

const MARKETING_ROUTES: MarketingRoute[] = [
  { path: "/", priority: 1 },
  { path: "/how-it-works", priority: 0.9 },
  { path: "/pricing", priority: 0.9 },
  { path: "/keepsakes", priority: 0.8 },
  { path: "/gold-book", priority: 0.8 },
  { path: "/for-planners", priority: 0.8 },
  { path: "/sample", priority: 0.7 },
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/careers", priority: 0.4 },
  { path: "/changelog", priority: 0.4 },
  { path: "/sustainability", priority: 0.4 },
  { path: "/legal/privacy", priority: 0.3 },
  { path: "/legal/terms", priority: 0.3 },
  { path: "/legal/cookies", priority: 0.3 },
  { path: "/legal/refunds", priority: 0.3 },
];

const buildRouteEntries = ({
  path,
  priority,
}: MarketingRoute): MetadataRoute.Sitemap => {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, absoluteUrl(localizePath(locale, path))]),
  );

  return locales.map((locale) => ({
    url: absoluteUrl(localizePath(locale, path)),
    changeFrequency: "weekly",
    priority,
    alternates: { languages },
  }));
};

const sitemap = (): MetadataRoute.Sitemap =>
  MARKETING_ROUTES.flatMap(buildRouteEntries);

export default sitemap;
