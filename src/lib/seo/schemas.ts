import { appUrl } from "./urls";
import { clientEnv } from "@/lib/utils/env.client";

type FaqItem = {
  q: string;
  a: string;
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
