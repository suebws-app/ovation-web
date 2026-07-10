export type Tier = {
  key: string;
  planCode: string | null;
  highlighted: boolean;
  tagKey: string;
  nameKey: string;
  price: string;
  perKey: string;
  descKey: string;
  ctaKey: string;
  featKeys: string[];
  href: string;
};

const KEEPSAKE_FEAT_KEYS = [
  "marketing__pricing__feats__one_event",
  "marketing__pricing__feats__access_12_months",
  "marketing__pricing__keepsake_feats__unlimited_messages",
  "marketing__pricing__keepsake_feats__auto_transcription",
  "marketing__pricing__keepsake_feats__custom_couple_domain",
  "marketing__pricing__keepsake_feats__zip_export",
  "marketing__pricing__keepsake_feats__kiosk_mode",
];

const GOLD_FEAT_KEYS = [
  "marketing__pricing__feats__one_event",
  "marketing__pricing__feats__access_24_months",
  "marketing__pricing__keepsake_feats__unlimited_messages",
  "marketing__pricing__keepsake_feats__auto_transcription",
  "marketing__pricing__keepsake_feats__custom_couple_domain",
  "marketing__pricing__keepsake_feats__zip_export",
  "marketing__pricing__keepsake_feats__kiosk_mode",
];

const PRO_STARTER_FEAT_KEYS = [
  "marketing__pricing__pro_starter_feats__events_per_month",
  "marketing__pricing__pro_starter_feats__storage_12_months",
  "marketing__pricing__pro_starter_feats__full_couple_experience",
  "marketing__pricing__pro_starter_feats__print_ready_qr_cards",
  "marketing__pricing__pro_starter_feats__multi_event_dashboard",
  "marketing__pricing__pro_starter_feats__guest_import_invitations",
];

const PRO_FEAT_KEYS = [
  "marketing__pricing__pro_feats__events_per_month",
  "marketing__pricing__pro_feats__storage_24_months",
  "marketing__pricing__pro_studio_feats__everything_in_starter",
  "marketing__pricing__pro_studio_feats__multi_seat_access",
  "marketing__pricing__pro_studio_feats__custom_branding",
  "marketing__pricing__pro_studio_feats__analytics",
  "marketing__pricing__pro_studio_feats__priority_support",
];

export const COUPLES_TIERS: Tier[] = [
  {
    key: "keepsake",
    planCode: "premium",
    highlighted: false,
    tagKey: "marketing__pricing__keepsake_tag_v2",
    nameKey: "marketing__pricing__keepsake_name",
    price: "€49",
    perKey: "marketing__pricing__one_time",
    descKey: "marketing__pricing__keepsake_desc",
    ctaKey: "marketing__pricing__keepsake_cta",
    featKeys: KEEPSAKE_FEAT_KEYS,
    href: "/sign-up?plan=keepsake",
  },
  {
    key: "gold",
    planCode: "bundle",
    highlighted: true,
    tagKey: "marketing__pricing__gold_tag_v2",
    nameKey: "marketing__pricing__gold_name_v2",
    price: "€99",
    perKey: "marketing__pricing__one_time",
    descKey: "marketing__pricing__gold_desc_v3",
    ctaKey: "marketing__pricing__gold_cta_v2",
    featKeys: GOLD_FEAT_KEYS,
    href: "/sign-up?plan=gold",
  },
];

export const PRO_TIERS: Tier[] = [
  {
    key: "pro_starter",
    planCode: "pro_starter",
    highlighted: false,
    tagKey: "marketing__pricing__pro_starter_tag",
    nameKey: "marketing__pricing__pro_starter_name",
    price: "€29",
    perKey: "marketing__pricing__per_month",
    descKey: "marketing__pricing__pro_starter_desc_v2",
    ctaKey: "marketing__pricing__pro_starter_cta",
    featKeys: PRO_STARTER_FEAT_KEYS,
    href: "/sign-up?as=pro&plan=pro_starter",
  },
  {
    key: "pro_studio",
    planCode: "pro_studio",
    highlighted: true,
    tagKey: "marketing__pricing__pro_studio_tag",
    nameKey: "marketing__pricing__pro_name",
    price: "€79",
    perKey: "marketing__pricing__per_month",
    descKey: "marketing__pricing__pro_desc",
    ctaKey: "marketing__pricing__pro_studio_cta",
    featKeys: PRO_FEAT_KEYS,
    href: "/sign-up?as=pro&plan=pro_studio",
  },
];
