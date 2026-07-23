import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  buildLanguageAlternates,
  localizedAbsoluteUrl,
  openGraphAlternateLocales,
  openGraphLocale,
} from "@/lib/seo/urls";
import { findCompetitor } from "./competitors";
import type { CompetitorPageVariant } from "./CompetitorPage";

interface Args {
  params: Promise<{ locale: string; competitor: string }>;
  variant: CompetitorPageVariant;
}

export const generateCompetitorMetadata = async ({
  params,
  variant,
}: Args): Promise<Metadata> => {
  const { locale, competitor: slug } = await params;
  const competitor = findCompetitor(slug);
  if (!competitor) notFound();

  const t = await getTranslations({ locale });
  const basePath = variant === "vs" ? "/vs" : "/alternatives";
  const path = `${basePath}/${slug}`;
  const canonical = localizedAbsoluteUrl(locale, path);
  const title =
    variant === "vs"
      ? t("seo__competitor__vs_title", { competitor: competitor.name })
      : t("seo__competitor__alternatives_title", {
          competitor: competitor.name,
        });
  const tagline = t(`marketing__vs__${slug}__tagline`);
  const description = t("seo__competitor__description", {
    competitor: competitor.name,
    tagline,
  });

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      locale: openGraphLocale(locale),
      alternateLocale: openGraphAlternateLocales(locale),
    },
    twitter: { card: "summary_large_image", title, description },
  };
};
