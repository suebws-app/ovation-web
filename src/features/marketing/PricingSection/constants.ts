export const PRICES = {
  essential: "€0",
  keepsake: "€189",
  gold: "€389",
} as const;

const ESSENTIAL_FEAT_KEYS = [
  "marketing__pricing__essential_feats__unlimited_messages_photos",
  "marketing__pricing__essential_feats__auto_transcription_38_langs",
  "marketing__pricing__essential_feats__web_dashboard",
  "marketing__pricing__essential_feats__30_day_ritual_inbox",
  "marketing__pricing__essential_feats__lifetime_audio_storage",
];

const KEEPSAKE_FEAT_KEYS = [
  "marketing__pricing__keepsake_feats__up_to_250_guests",
  "marketing__pricing__keepsake_feats__letterpress_qr_card_deck_shipped",
  "marketing__pricing__keepsake_feats__unlimited_languages_translations",
  "marketing__pricing__keepsake_feats__planner_co_pilot_seat",
  "marketing__pricing__keepsake_feats__priority_guest_support",
  "marketing__pricing__keepsake_feats__custom_couple_domain",
];

const GOLD_FEAT_KEYS = [
  "marketing__pricing__gold_feats__everything_in_keepsake",
  "marketing__pricing__gold_feats__the_gold_book_180_pp_linen_bound",
  "marketing__pricing__gold_feats__custom_cover_foil_monogram",
  "marketing__pricing__gold_feats__archival_grade_paper",
  "marketing__pricing__gold_feats__global_free_shipping",
  "marketing__pricing__gold_feats__25_off_re_prints_forever",
];

export type Tier = {
  key: "essential" | "keepsake" | "gold";
  highlighted: boolean;
  tagKey: string;
  nameKey: string;
  priceKey: string;
  perKey: string;
  descKey: string;
  ctaKey: string;
  featKeys: string[];
};

export const TIERS: Tier[] = [
  {
    key: "essential",
    highlighted: false,
    tagKey: "marketing__pricing__essential_tag",
    nameKey: "marketing__pricing__essential_name",
    priceKey: "marketing__pricing__essential_price",
    perKey: "marketing__pricing__essential_per",
    descKey: "marketing__pricing__essential_desc",
    ctaKey: "marketing__pricing__essential_cta",
    featKeys: ESSENTIAL_FEAT_KEYS,
  },
  {
    key: "keepsake",
    highlighted: true,
    tagKey: "marketing__pricing__keepsake_tag",
    nameKey: "marketing__pricing__keepsake_name",
    priceKey: "marketing__pricing__keepsake_price",
    perKey: "marketing__pricing__keepsake_per",
    descKey: "marketing__pricing__keepsake_desc",
    ctaKey: "marketing__pricing__keepsake_cta",
    featKeys: KEEPSAKE_FEAT_KEYS,
  },
  {
    key: "gold",
    highlighted: false,
    tagKey: "marketing__pricing__gold_tag",
    nameKey: "marketing__pricing__gold_name",
    priceKey: "marketing__pricing__gold_price",
    perKey: "marketing__pricing__gold_per",
    descKey: "marketing__pricing__gold_desc",
    ctaKey: "marketing__pricing__gold_cta",
    featKeys: GOLD_FEAT_KEYS,
  },
];
