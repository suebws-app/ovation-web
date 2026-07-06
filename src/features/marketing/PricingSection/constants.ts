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
  "marketing__pricing__keepsake_feats__unlimited_messages",
  "marketing__pricing__keepsake_feats__print_ready_qr_cards",
  "marketing__pricing__keepsake_feats__auto_transcription",
  "marketing__pricing__keepsake_feats__custom_couple_domain",
  "marketing__pricing__keepsake_feats__zip_export",
  "marketing__pricing__keepsake_feats__kiosk_mode",
];

const GOLD_FEAT_KEYS = [
  "marketing__pricing__gold_feats__everything_in_keepsake",
  "marketing__pricing__gold_feats__the_gold_book_180_pp_linen_bound",
  "marketing__pricing__gold_feats__premium_paper_options",
];

const PRO_STARTER_FEAT_KEYS = [
  "marketing__pricing__pro_starter_feats__up_to_12_events",
  "marketing__pricing__pro_starter_feats__full_couple_experience",
  "marketing__pricing__pro_starter_feats__print_ready_qr_cards",
  "marketing__pricing__pro_starter_feats__multi_event_dashboard",
  "marketing__pricing__pro_starter_feats__guest_import_invitations",
];

const PRO_STUDIO_FEAT_KEYS = [
  "marketing__pricing__pro_studio_feats__unlimited_events",
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
    highlighted: true,
    tagKey: "marketing__pricing__keepsake_tag",
    nameKey: "marketing__pricing__keepsake_name",
    price: "€189",
    perKey: "marketing__pricing__one_time",
    descKey: "marketing__pricing__keepsake_desc",
    ctaKey: "marketing__pricing__keepsake_cta",
    featKeys: KEEPSAKE_FEAT_KEYS,
    href: "/sign-up?plan=keepsake",
  },
  {
    key: "gold",
    planCode: "bundle",
    highlighted: false,
    tagKey: "marketing__pricing__gold_tag",
    nameKey: "marketing__pricing__gold_name",
    price: "€399",
    perKey: "marketing__pricing__one_time",
    descKey: "marketing__pricing__gold_desc_v2",
    ctaKey: "marketing__pricing__gold_cta",
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
    price: "€49",
    perKey: "marketing__pricing__per_month",
    descKey: "marketing__pricing__pro_starter_desc",
    ctaKey: "marketing__pricing__pro_starter_cta",
    featKeys: PRO_STARTER_FEAT_KEYS,
    href: "/sign-up?as=pro&plan=pro_starter",
  },
  {
    key: "pro_studio",
    planCode: "pro_studio",
    highlighted: true,
    tagKey: "marketing__pricing__pro_studio_tag",
    nameKey: "marketing__pricing__pro_studio_name",
    price: "€129",
    perKey: "marketing__pricing__per_month",
    descKey: "marketing__pricing__pro_studio_desc",
    ctaKey: "marketing__pricing__pro_studio_cta",
    featKeys: PRO_STUDIO_FEAT_KEYS,
    href: "/sign-up?as=pro&plan=pro_studio",
  },
];
