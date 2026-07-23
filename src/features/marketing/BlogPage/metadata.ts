import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ApiError } from "@/lib/api/client";
import { blogApi, type BlogArticleAlternate } from "@/lib/api/blog";
import {
  buildLanguageAlternates,
  localizedAbsoluteUrl,
  openGraphAlternateLocales,
  openGraphLocale,
} from "@/lib/seo/urls";
import { defaultLocale } from "@/i18n/config";
import type { LocalePageProps } from "@/i18n/types";

// Always emits self-reference + x-default per Google's guidance, even when
// this article has no translations yet. If the current article isn't in the
// alternates payload (typical for single-locale rows), it's added.
const buildArticleLanguageAlternates = (
  currentLocale: string,
  currentSlug: string,
  alternates: BlogArticleAlternate[],
): Record<string, string> => {
  const map = new Map<string, string>();
  map.set(
    currentLocale,
    localizedAbsoluteUrl(currentLocale, `/blog/${currentSlug}`),
  );
  for (const alt of alternates) {
    map.set(alt.locale, localizedAbsoluteUrl(alt.locale, `/blog/${alt.slug}`));
  }
  const defaultAlt = map.get(defaultLocale);
  if (defaultAlt) {
    map.set("x-default", defaultAlt);
  } else {
    // Source article isn't in the default locale — fall back to the
    // current URL as the x-default so Google always has one.
    map.set("x-default", map.get(currentLocale)!);
  }
  return Object.fromEntries(map);
};

type BlogListMetadataProps = LocalePageProps & {
  searchParams?: Promise<{ page?: string }>;
};

const parsePage = (raw: string | undefined): number => {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
};

export const generateBlogListMetadata = async ({
  params,
  searchParams,
}: BlogListMetadataProps): Promise<Metadata> => {
  const { locale } = await params;
  const pageParams = searchParams ? await searchParams : { page: undefined };
  const page = parsePage(pageParams.page);
  const t = await getTranslations({ locale });
  const baseTitle = t("marketing__blog__list__meta_title");
  const description = t("marketing__blog__list__subtitle");
  // Pages 2+ get a unique title so Google doesn't fold them under the root.
  const title =
    page === 1
      ? baseTitle
      : `${baseTitle} — ${t("common__pagination__page_of", { current: page })}`;
  const canonicalUrl = localizedAbsoluteUrl(locale, "/blog");
  const pageUrl =
    page === 1
      ? canonicalUrl
      : localizedAbsoluteUrl(locale, `/blog?page=${page}`);
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates("/blog"),
    },
    robots: page === 1 ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      locale: openGraphLocale(locale),
      alternateLocale: openGraphAlternateLocales(locale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

interface ArticlePageParams {
  params: Promise<{ locale: string; slug: string }>;
}

export const generateBlogArticleMetadata = async ({
  params,
}: ArticlePageParams): Promise<Metadata> => {
  const { locale, slug } = await params;
  try {
    const { article, alternates } = await blogApi.publicGet(slug, locale);
    const title = article.metaTitle ?? article.title;
    const description = article.metaDescription ?? article.excerpt ?? undefined;
    const canonical = localizedAbsoluteUrl(locale, `/blog/${slug}`);
    return {
      title,
      description,
      alternates: {
        canonical,
        languages: buildArticleLanguageAlternates(
          locale,
          slug,
          alternates ?? [],
        ),
      },
      openGraph: {
        title,
        description,
        type: "article",
        url: canonical,
        locale: openGraphLocale(locale),
        alternateLocale: openGraphAlternateLocales(locale),
        images: article.coverImageUrl
          ? [
              {
                url: article.coverImageUrl,
                width: 1024,
                height: 1024,
                alt: article.coverImageAlt ?? article.title,
              },
            ]
          : undefined,
        publishedTime: article.publishedAt ?? undefined,
        modifiedTime: article.updatedAt,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: article.coverImageUrl
          ? [
              {
                url: article.coverImageUrl,
                alt: article.coverImageAlt ?? article.title,
              },
            ]
          : undefined,
      },
    };
  } catch (err) {
    if (ApiError.isApiError(err) && err.status === 404) notFound();
    throw err;
  }
};
