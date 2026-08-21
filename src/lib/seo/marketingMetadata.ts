import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  buildLanguageAlternates,
  localizedAbsoluteUrl,
  openGraphAlternateLocales,
  openGraphLocale,
} from "./urls";

type PageMetadataProps = {
  params: Promise<{ locale: string }>;
};

type MarketingPageConfig = {
  page: string;
  path: string;
  absoluteTitle?: boolean;
};

// OpenGraph/Twitter images are handled by Next.js's file-based convention:
// - The root src/app/opengraph-image.png is used automatically for every route.
// - Routes that override with their own opengraph-image.[ext] file win.
// We do NOT set `images` here — a manual URL like "/opengraph-image.png"
// bypasses the file convention and 404s in production.

const buildMetadataGenerator =
  ({ page, path, absoluteTitle = false }: MarketingPageConfig) =>
  async ({ params }: PageMetadataProps): Promise<Metadata> => {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const title = t(`seo__${page}__title`);
    const description = t(`seo__${page}__description`);
    const canonicalUrl = localizedAbsoluteUrl(locale, path);

    return {
      title: absoluteTitle ? { absolute: title } : title,
      description,
      alternates: {
        canonical: canonicalUrl,
        languages: buildLanguageAlternates(path),
      },
      openGraph: {
        type: "website",
        siteName: "Ovation",
        title,
        description,
        url: canonicalUrl,
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

export const generateGeneralLandingMetadata = buildMetadataGenerator({
  page: "landing",
  path: "/",
  absoluteTitle: true,
});

export const generateAboutMetadata = buildMetadataGenerator({
  page: "about",
  path: "/about",
});

export const generateCareersMetadata = buildMetadataGenerator({
  page: "careers",
  path: "/careers",
});

export const generateChangelogMetadata = buildMetadataGenerator({
  page: "changelog",
  path: "/changelog",
});

export const generateContactMetadata = buildMetadataGenerator({
  page: "contact",
  path: "/contact",
});

export const generateForPlannersMetadata = buildMetadataGenerator({
  page: "for_planners",
  path: "/for-planners",
});

export const generateUseCasesIndexMetadata = buildMetadataGenerator({
  page: "use_cases_index",
  path: "/use-cases",
});

export const generateForProsMetadata = buildMetadataGenerator({
  page: "for_pros",
  path: "/for-pros",
});

export const generateForPhotographersMetadata = buildMetadataGenerator({
  page: "for_photographers",
  path: "/for-photographers",
});

export const generateForVenuesMetadata = buildMetadataGenerator({
  page: "for_venues",
  path: "/for-venues",
});

export const generateForFamilyMetadata = buildMetadataGenerator({
  page: "for_family",
  path: "/for-family",
});

export const generateForMediaMetadata = buildMetadataGenerator({
  page: "for_media",
  path: "/for-media",
});

export const generateTemplatesMetadata = buildMetadataGenerator({
  page: "templates",
  path: "/templates",
});

export const generateGoldBookMetadata = buildMetadataGenerator({
  page: "gold_book",
  path: "/gold-book",
});

export const generateHowItWorksMetadata = buildMetadataGenerator({
  page: "how_it_works",
  path: "/how-it-works",
});

export const generateKeepsakesMetadata = buildMetadataGenerator({
  page: "keepsakes",
  path: "/keepsakes",
});

export const generatePricingMetadata = buildMetadataGenerator({
  page: "pricing",
  path: "/pricing",
});

export const generateSampleMetadata = buildMetadataGenerator({
  page: "sample",
  path: "/sample",
});

export const generateSustainabilityMetadata = buildMetadataGenerator({
  page: "sustainability",
  path: "/sustainability",
});

export const generateLegalCookiesMetadata = buildMetadataGenerator({
  page: "legal_cookies",
  path: "/legal/cookies",
});

export const generateLegalPrivacyMetadata = buildMetadataGenerator({
  page: "legal_privacy",
  path: "/legal/privacy",
});

export const generateLegalRefundsMetadata = buildMetadataGenerator({
  page: "legal_refunds",
  path: "/legal/refunds",
});

export const generateLegalTermsMetadata = buildMetadataGenerator({
  page: "legal_terms",
  path: "/legal/terms",
});

export const generateWeddingPlannerMetadata = buildMetadataGenerator({
  page: "wedding_planner",
  path: "/wedding-planner",
});
