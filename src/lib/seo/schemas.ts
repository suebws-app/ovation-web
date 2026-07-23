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

const organizationSameAs = (): string[] =>
  [
    clientEnv.SOCIAL_INSTAGRAM_URL,
    clientEnv.SOCIAL_TIKTOK_URL,
    clientEnv.SOCIAL_LINKEDIN_URL,
    clientEnv.SOCIAL_X_URL,
    clientEnv.SOCIAL_FACEBOOK_URL,
    clientEnv.SOCIAL_YOUTUBE_URL,
  ].filter((url): url is string => Boolean(url));

export const organizationSchema = () => {
  const sameAs = organizationSameAs();
  return {
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
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
};

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

type PersonAuthor = {
  slug: string;
  name: string;
  imageUrl?: string | null;
  bio?: string;
  sameAs?: string[];
};

export const personSchema = (person: PersonAuthor) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${appUrl}/authors/${person.slug}#person`,
  name: person.name,
  url: `${appUrl}/authors/${person.slug}`,
  image: person.imageUrl ?? undefined,
  description: person.bio,
  sameAs: person.sameAs && person.sameAs.length > 0 ? person.sameAs : undefined,
});

type BlogPostingSchemaExtras = {
  author?: PersonAuthor;
};

export const blogPostingSchema = (
  input: BlogPostingInput,
  extras: BlogPostingSchemaExtras = {},
) => ({
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
        name: input.imageAlt,
      }
    : undefined,
  datePublished: input.datePublished,
  dateModified: input.dateModified,
  wordCount: input.wordCount,
  timeRequired: isoDuration(input.readingMinutes),
  keywords: input.keywords.filter(Boolean).join(", ") || undefined,
  author: extras.author
    ? {
        "@type": "Person",
        "@id": `${appUrl}/authors/${extras.author.slug}#person`,
        name: extras.author.name,
        url: `${appUrl}/authors/${extras.author.slug}`,
        image: extras.author.imageUrl ?? undefined,
      }
    : {
        "@type": "Organization",
        "@id": `${appUrl}/#organization`,
        name: "Ovation Editorial",
        url: `${appUrl}/about`,
      },
  publisher: { "@id": `${appUrl}/#organization` },
  isPartOf: { "@id": `${appUrl}/#website` },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2", ".blog-prose > p:first-of-type"],
  },
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

type OfferInput = {
  price: string;
  priceCurrency: string;
  url: string;
  availability?: string;
};

type AggregateOfferInput = {
  lowPrice: string;
  highPrice: string;
  priceCurrency: string;
  offerCount: number;
  url: string;
};

type ProductSchemaInput = {
  name: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  brand?: string;
  offer?: OfferInput;
  aggregateOffer?: AggregateOfferInput;
};

export const productSchema = (input: ProductSchemaInput) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: input.name,
  description: input.description,
  url: input.url,
  image: input.imageUrl ?? undefined,
  brand: {
    "@type": "Brand",
    name: input.brand ?? "Ovation",
  },
  offers: input.aggregateOffer
    ? {
        "@type": "AggregateOffer",
        lowPrice: input.aggregateOffer.lowPrice,
        highPrice: input.aggregateOffer.highPrice,
        priceCurrency: input.aggregateOffer.priceCurrency,
        offerCount: input.aggregateOffer.offerCount,
        url: input.aggregateOffer.url,
      }
    : input.offer
      ? {
          "@type": "Offer",
          price: input.offer.price,
          priceCurrency: input.offer.priceCurrency,
          url: input.offer.url,
          availability:
            input.offer.availability ?? "https://schema.org/InStock",
        }
      : undefined,
});

type ItemListEntry = {
  name: string;
  url: string;
  image?: string | null;
  description?: string;
  priceCents?: number;
  currency?: string;
  availability?: string;
};

export const itemListSchema = (name: string, items: ItemListEntry[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      name: item.name,
      url: item.url,
      description: item.description,
      image: item.image ?? undefined,
      brand: { "@type": "Brand", name: "Ovation" },
      offers:
        typeof item.priceCents === "number" && item.currency
          ? {
              "@type": "Offer",
              price: (item.priceCents / 100).toFixed(2),
              priceCurrency: item.currency,
              url: item.url,
              availability: item.availability ?? "https://schema.org/InStock",
            }
          : undefined,
    },
  })),
});
