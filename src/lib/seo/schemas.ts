import { appUrl } from "./urls";

type FaqItem = {
  q: string;
  a: string;
};

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${appUrl}/#organization`,
  name: "Ovation",
  url: appUrl,
  logo: `${appUrl}/apple-icon.png`,
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
