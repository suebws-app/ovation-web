import { appUrl } from "./urls";
import { clientEnv } from "@/lib/utils/env.client";

type FaqItem = {
  q: string;
  a: string;
};

type BlogPostingInput = {
  url: string;
  headline: string;
  description: string | undefined;
  imageUrl: string | null;
  imageAlt: string;
  datePublished: string | undefined;
  dateModified: string;
  locale: string;
  wordCount: number;
  readingMinutes: number;
  keywords: string[];
};

type BreadcrumbCrumb = {
  name: string;
  url: string;
};

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${appUrl}/#organization`,
  name: "Ovation",
  legalName: clientEnv.LEGAL_ENTITY_NAME,
  url: appUrl,
  logo: `${appUrl}/apple-icon.png`,
  foundingDate: "2026",
  address: clientEnv.LEGAL_ENTITY_ADDRESS,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: clientEnv.SUPPORT_EMAIL,
    availableLanguage: "en",
  },
});

export const webSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${appUrl}/#website`,
  name: "Ovation",
  url: appUrl,
  publisher: { "@id": `${appUrl}/#organization` },
  // SearchAction / sitelinks searchbox removed: no /search route exists
  // yet. Add it back once we ship an actual search page — pointing at a
  // 404 disqualifies the sitelinks searchbox and triggers Search Console
  // structured-data warnings.
});

export const faqPageSchema = (items: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
});

// Minutes → ISO 8601 duration (PT5M). Google Rich Results validates this.
const isoDuration = (minutes: number): string =>
  `PT${Math.max(1, Math.round(minutes))}M`;

export const blogPostingSchema = (input: BlogPostingInput) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: input.headline,
  description: input.description,
  url: input.url,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": input.url,
  },
  inLanguage: input.locale,
  image: input.imageUrl
    ? {
        "@type": "ImageObject",
        url: input.imageUrl,
        width: 1024,
        height: 1024,
        // Article title as image "name" (not caption — caption is the
        // spoken/written text under the image; name is the identifying
        // label).
        name: input.imageAlt,
      }
    : undefined,
  datePublished: input.datePublished,
  dateModified: input.dateModified,
  wordCount: input.wordCount,
  timeRequired: isoDuration(input.readingMinutes),
  keywords: input.keywords.filter(Boolean).join(", ") || undefined,
  author: {
    "@type": "Organization",
    "@id": `${appUrl}/#organization`,
    name: "Ovation Editorial",
    url: `${appUrl}/about`,
  },
  publisher: { "@id": `${appUrl}/#organization` },
  isPartOf: { "@id": `${appUrl}/#website` },
});

// Home › Blog › Article — required for breadcrumb rich results.
export const breadcrumbListSchema = (items: BreadcrumbCrumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
