import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";
import { localizedAbsoluteUrl } from "@/lib/seo/urls";
import { blogApi, type BlogListItem } from "@/lib/api/blog";
import { COMPETITORS } from "@/features/marketing/CompetitorPage";
import { USE_CASES } from "@/features/marketing/UseCasePage";

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
  { path: "/for-photographers", priority: 0.7 },
  { path: "/for-venues", priority: 0.7 },
  { path: "/for-family", priority: 0.7 },
  { path: "/for-media", priority: 0.4 },
  { path: "/templates", priority: 0.6 },
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

// One sitemap entry per (locale × article) using each locale's actual
// translated slug. Also emits per-entry hreflang alternates built from
// the same per-locale slug map so Google can group localized variants
// straight from the sitemap without following crawl-time HTML alternates.
const buildBlogArticleEntries = async (): Promise<MetadataRoute.Sitemap> => {
  const perLocale = await Promise.all(
    locales.map(async (locale) => {
      const items = await fetchAllPublishedArticles(locale);
      return { locale, items };
    }),
  );

  // Group by article id so entries in one cluster (source + translations)
  // share the same hreflang languages map. `article.id` is stable across
  // locales for translations (it's the row id, not the group id), so we
  // need to key on either sourceArticleId or id — the list API doesn't
  // return sourceArticleId, so we group by (locale, id) tuple and let
  // slug-per-locale carry the parity. Practical fallback: emit alternates
  // limited to the locales that have a slug for this article's title
  // string is unreliable — use publishedAt+title as a coarse group key.
  const groupKey = (article: BlogListItem) =>
    `${article.publishedAt ?? ""}::${article.title}`;

  const clusters = new Map<string, Record<string, string>>();
  for (const { locale, items } of perLocale) {
    for (const article of items) {
      const key = groupKey(article);
      const cluster = clusters.get(key) ?? {};
      cluster[locale] = localizedAbsoluteUrl(locale, `/blog/${article.slug}`);
      clusters.set(key, cluster);
    }
  }
  // Add x-default per cluster (default-locale URL if present, otherwise
  // any URL).
  for (const cluster of clusters.values()) {
    const fallback = cluster[defaultLocale] ?? Object.values(cluster)[0];
    if (fallback) cluster["x-default"] = fallback;
  }

  const entries: MetadataRoute.Sitemap = [];
  for (const { locale, items } of perLocale) {
    for (const article of items) {
      const cluster = clusters.get(groupKey(article)) ?? {};
      const lastModified = article.updatedAt
        ? new Date(article.updatedAt)
        : article.publishedAt
          ? new Date(article.publishedAt)
          : undefined;
      entries.push({
        url: localizedAbsoluteUrl(locale, `/blog/${article.slug}`),
        lastModified:
          lastModified && !Number.isNaN(lastModified.getTime())
            ? lastModified
            : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: { languages: cluster },
      });
    }
  }
  return entries;
};

const fetchAuthorSlugs = async (): Promise<string[]> => {
  try {
    const { authors } = await blogApi.publicAuthorList();
    return authors.map((author) => author.slug);
  } catch {
    return [];
  }
};

const buildAuthorEntries = async (): Promise<MetadataRoute.Sitemap> => {
  const slugs = await fetchAuthorSlugs();
  return slugs.flatMap((slug) =>
    buildRouteEntries({ path: `/authors/${slug}`, priority: 0.4 }),
  );
};

const buildCompetitorEntries = (): MetadataRoute.Sitemap =>
  COMPETITORS.flatMap((competitor) => [
    ...buildRouteEntries({
      path: `/vs/${competitor.slug}`,
      priority: 0.7,
    }),
    ...buildRouteEntries({
      path: `/alternatives/${competitor.slug}`,
      priority: 0.7,
    }),
  ]);

const buildUseCaseEntries = (): MetadataRoute.Sitemap =>
  USE_CASES.flatMap((useCase) =>
    buildRouteEntries({
      path: `/use-cases/${useCase.slug}`,
      priority: 0.6,
    }),
  );

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [routeEntries, articleEntries, authorEntries] = await Promise.all([
    Promise.resolve(MARKETING_ROUTES.flatMap(buildRouteEntries)),
    buildBlogArticleEntries(),
    buildAuthorEntries(),
  ]);
  return [
    ...routeEntries,
    ...buildCompetitorEntries(),
    ...buildUseCaseEntries(),
    ...articleEntries,
    ...authorEntries,
  ];
};

export default sitemap;
