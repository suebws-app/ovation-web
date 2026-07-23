import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  buildLanguageAlternates,
  localizedAbsoluteUrl,
  openGraphAlternateLocales,
  openGraphLocale,
} from "@/lib/seo/urls";
import { findUseCase } from "./useCases";

interface Args {
  params: Promise<{ locale: string; case: string }>;
}

export const generateUseCaseMetadata = async ({
  params,
}: Args): Promise<Metadata> => {
  const { locale, case: slug } = await params;
  const useCase = findUseCase(slug);
  if (!useCase) notFound();

  const t = await getTranslations({ locale });
  const path = `/use-cases/${slug}`;
  const canonical = localizedAbsoluteUrl(locale, path);
  const localizedTitle = t(`marketing__use_case__${slug}__title`);
  const localizedSubtitle = t(`marketing__use_case__${slug}__subtitle`);
  const title = t("seo__use_case__title", { title: localizedTitle });
  const description = t("seo__use_case__description", {
    subtitle: localizedSubtitle,
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
