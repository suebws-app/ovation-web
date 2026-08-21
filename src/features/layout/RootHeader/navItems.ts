import { StoreIcon } from "@ovation/icons/StoreIcon";
import { OCCASION_NAV_ITEMS } from "@/features/marketing/occasionNav";
import { appRoutes } from "@/lib/routes";

export const USE_CASES_MENU_ITEMS = [
  ...OCCASION_NAV_ITEMS.map((item) => ({
    key: item.key,
    href: item.isCta ? appRoutes.marketing.useCases : item.href,
    Icon: item.Icon,
    labelKey: `marketing__nav__occasion__${item.key}__title`,
    descriptionKey: `marketing__nav__occasion__${item.key}__subtitle`,
  })),
  {
    key: "pros",
    href: appRoutes.marketing.forPros,
    Icon: StoreIcon,
    labelKey: "marketing__nav__for_pros",
    descriptionKey: "marketing__nav__for_pros__subtitle",
  },
];
