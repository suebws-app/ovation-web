import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ApiError } from "@/lib/api/client";
import { blogApi, type BlogArticleAlternate } from "@/lib/api/blog";
import { buildLanguageAlternates, localizedAbsoluteUrl } from "@/lib/seo/urls";
import { defaultLocale } from "@/i18n/config";
import type { LocalePageProps } from "@/i18n/types";

const buildArticleLanguageAlternates = (
  alternates: BlogArticleAlternate[],
): Record<string, string> | undefined => {
  if (alternates.length < 2) return undefined;
  const languages = Object.fromEntries(
    alternates.map((alt) => [
      alt.locale,
      localizedAbsoluteUrl(alt.locale, `/blog/${alt.slug}`),
    ]),
  );
  const defaultVersion = alternates.find((alt) => alt.locale === defaultLocale);
  if (defaultVersion) {
    languages["x-default"] = localizedAbsoluteUrl(
      defaultVersion.locale,
      `/blog/${defaultVersion.slug}`,
    );
  }
  return languages;
};

export const generateBlogListMetadata = async ({
  params,
}: LocalePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const title = t("marketing__blog__list__meta_title");
  const description = t("marketing__blog__list__subtitle");
  return {
    title,
    description,
    alternates: {
      canonical: localizedAbsoluteUrl(locale, "/blog"),
      languages: buildLanguageAlternates("/blog"),
    },
    openGraph: { title, description, type: "website" },
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
    return {
      title: article.metaTitle ?? article.title,
      description: article.metaDescription ?? article.excerpt ?? undefined,
      alternates: {
        canonical: localizedAbsoluteUrl(locale, `/blog/${slug}`),
        languages: buildArticleLanguageAlternates(alternates ?? []),
      },
      openGraph: {
        title: article.metaTitle ?? article.title,
        description: article.metaDescription ?? article.excerpt ?? undefined,
        type: "article",
        images: article.coverImageUrl
          ? [{ url: article.coverImageUrl }]
          : undefined,
        publishedTime: article.publishedAt ?? undefined,
        modifiedTime: article.updatedAt,
      },
    };
  } catch (err) {
    if (ApiError.isApiError(err) && err.status === 404) notFound();
    throw err;
  }
};
