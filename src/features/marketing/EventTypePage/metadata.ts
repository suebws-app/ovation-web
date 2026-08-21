import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  buildLanguageAlternates,
  localizedAbsoluteUrl,
  openGraphAlternateLocales,
  openGraphLocale,
} from "@/lib/seo/urls";
import { findEventTypePage } from "./eventTypePages";

interface Args {
  params: Promise<{ locale: string; case: string }>;
}

export const generateEventTypeMetadata = async ({
  params,
}: Args): Promise<Metadata> => {
  const { locale, case: slug } = await params;
  const page = findEventTypePage(slug);
  if (!page) notFound();

  const t = await getTranslations({ locale });
  const path = `/use-cases/${slug}`;
  const canonical = localizedAbsoluteUrl(locale, path);
  const title = t(`marketing__event_type__${slug}__seo_title`);
  const description = t(`marketing__event_type__${slug}__seo_description`);

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
