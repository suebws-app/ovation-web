export type AudienceKey = "photographers" | "venues" | "family";

export type AudiencePageContent = {
  key: AudienceKey;
  path: string;
  seoPage: string;
  eyebrowKey: string;
  titleKey: string;
  subtitleKey: string;
  bulletKeys: string[];
  ctaPrimaryKey: string;
  ctaSecondaryKey: string;
};

export const AUDIENCE_PAGES: AudiencePageContent[] = [
  {
    key: "photographers",
    path: "/for-photographers",
    seoPage: "for_photographers",
    eyebrowKey: "marketing__audience_photographers__eyebrow",
    titleKey: "marketing__audience_photographers__title",
    subtitleKey: "marketing__audience_photographers__subtitle",
    bulletKeys: [
      "marketing__audience_photographers__bullet_1",
      "marketing__audience_photographers__bullet_2",
      "marketing__audience_photographers__bullet_3",
      "marketing__audience_photographers__bullet_4",
    ],
    ctaPrimaryKey: "marketing__audience__cta_primary",
    ctaSecondaryKey: "marketing__audience__cta_secondary",
  },
  {
    key: "venues",
    path: "/for-venues",
    seoPage: "for_venues",
    eyebrowKey: "marketing__audience_venues__eyebrow",
    titleKey: "marketing__audience_venues__title",
    subtitleKey: "marketing__audience_venues__subtitle",
    bulletKeys: [
      "marketing__audience_venues__bullet_1",
      "marketing__audience_venues__bullet_2",
      "marketing__audience_venues__bullet_3",
      "marketing__audience_venues__bullet_4",
    ],
    ctaPrimaryKey: "marketing__audience__cta_primary",
    ctaSecondaryKey: "marketing__audience__cta_secondary",
  },
  {
    key: "family",
    path: "/for-family",
    seoPage: "for_family",
    eyebrowKey: "marketing__audience_family__eyebrow",
    titleKey: "marketing__audience_family__title",
    subtitleKey: "marketing__audience_family__subtitle",
    bulletKeys: [
      "marketing__audience_family__bullet_1",
      "marketing__audience_family__bullet_2",
      "marketing__audience_family__bullet_3",
      "marketing__audience_family__bullet_4",
    ],
    ctaPrimaryKey: "marketing__audience__cta_primary",
    ctaSecondaryKey: "marketing__audience__cta_secondary",
  },
];

export const findAudiencePage = (
  key: AudienceKey,
): AudiencePageContent | undefined =>
  AUDIENCE_PAGES.find((page) => page.key === key);
