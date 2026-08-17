import { OCCASION_NAV_ITEMS } from "@/features/marketing/occasionNav";

export const USE_CASES_MENU_ITEMS = OCCASION_NAV_ITEMS.map((item) => ({
  key: item.key,
  href: item.href,
  Icon: item.Icon,
  labelKey: `marketing__nav__occasion__${item.key}__title`,
  descriptionKey: `marketing__nav__occasion__${item.key}__subtitle`,
}));
