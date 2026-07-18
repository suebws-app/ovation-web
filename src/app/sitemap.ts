import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";
import { buildLanguageAlternates, localizedAbsoluteUrl } from "@/lib/seo/urls";
import { blogApi, type BlogListItem } from "@/lib/api/blog";

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
  { path: "/blog", priority: 0.7 },
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
  const languages = {
    ...Object.fromEntries(
      locales.map((locale) => [locale, localizedAbsoluteUrl(locale, path)]),
    ),
    "x-default": localizedAbsoluteUrl(defaultLocale, path),
  };

  return locales.map((locale) => ({
    url: localizedAbsoluteUrl(locale, path),
    changeFrequency: "weekly",
    priority,
    alternates: { languages },
  }));
};

const fetchAllPublishedArticles = async (
  locale: string,
): Promise<BlogListItem[]> => {
  const all: BlogListItem[] = [];
  const PAGE_LIMIT = 50;
  const MAX_PAGES = 25;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await blogApi
      .publicList(locale, page, PAGE_LIMIT)
      .catch(() => null);
    if (!res || res.items.length === 0) break;
    all.push(...res.items);
    if (page >= res.totalPages) break;
  }
  return all;
};

const buildBlogArticleEntries = async (): Promise<MetadataRoute.Sitemap> => {
  const articles = await fetchAllPublishedArticles(defaultLocale);
  return articles.map((article) => {
    const path = `/blog/${article.slug}`;
    return {
      url: localizedAbsoluteUrl(defaultLocale, path),
      lastModified: article.publishedAt ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: buildLanguageAlternates(path) },
    };
  });
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [routeEntries, articleEntries] = await Promise.all([
    Promise.resolve(MARKETING_ROUTES.flatMap(buildRouteEntries)),
    buildBlogArticleEntries(),
  ]);
  return [...routeEntries, ...articleEntries];
};

export default sitemap;
