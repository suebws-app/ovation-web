import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { blogApi } from "@/lib/api/blog";
import {
  buildLanguageAlternates,
  localizedAbsoluteUrl,
  openGraphAlternateLocales,
  openGraphLocale,
} from "@/lib/seo/urls";

interface AuthorMetadataProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const generateAuthorMetadata = async ({
  params,
}: AuthorMetadataProps): Promise<Metadata> => {
  const { locale, slug } = await params;
  try {
    const { author } = await blogApi.publicAuthor(slug, locale);
    const title = `${author.name} — Ovation`;
    const description =
      author.bio ??
      `Articles by ${author.name} on wedding guest books, keepsakes, and more.`;
    const canonical = localizedAbsoluteUrl(locale, `/authors/${slug}`);
    return {
      title,
      description,
      alternates: {
        canonical,
        languages: buildLanguageAlternates(`/authors/${slug}`),
      },
      openGraph: {
        title,
        description,
        type: "profile",
        url: canonical,
        locale: openGraphLocale(locale),
        alternateLocale: openGraphAlternateLocales(locale),
        images: author.imageUrl ? [{ url: author.imageUrl }] : undefined,
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: author.imageUrl ? [author.imageUrl] : undefined,
      },
    };
  } catch (err) {
    if (ApiError.isApiError(err) && err.status === 404) notFound();
    throw err;
  }
};
