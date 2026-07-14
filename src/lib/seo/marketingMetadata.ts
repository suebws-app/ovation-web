import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildLanguageAlternates, localizePath } from "./urls";

type PageMetadataProps = {
  params: Promise<{ locale: string }>;
};

type MarketingPageConfig = {
  page: string;
  path: string;
  absoluteTitle?: boolean;
};

const buildMetadataGenerator =
  ({ page, path, absoluteTitle = false }: MarketingPageConfig) =>
  async ({ params }: PageMetadataProps): Promise<Metadata> => {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const title = t(`seo__${page}__title`);
    const description = t(`seo__${page}__description`);

    return {
      title: absoluteTitle ? { absolute: title } : title,
      description,
      alternates: {
        canonical: localizePath(locale, path),
        languages: buildLanguageAlternates(path),
      },
      openGraph: {
        type: "website",
        siteName: "Ovation",
        title,
        description,
        url: localizePath(locale, path),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  };

export const generateLandingMetadata = buildMetadataGenerator({
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
