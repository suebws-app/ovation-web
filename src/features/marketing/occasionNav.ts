import { HeartIcon } from "@ovation/icons/HeartIcon";
import { GiftIcon } from "@ovation/icons/GiftIcon";
import { SparkleIcon } from "@ovation/icons/SparkleIcon";
import { StarIcon } from "@ovation/icons/StarIcon";
import { UsersIcon } from "@ovation/icons/UsersIcon";
import { CalendarIcon } from "@ovation/icons/CalendarIcon";
import { LaurelIcon } from "@ovation/icons/LaurelIcon";
import { BookIcon } from "@ovation/icons/BookIcon";
import { appRoutes } from "@/lib/routes";

type OccasionNavItem = {
  key: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  href: string;
  isCta: boolean;
};

export const OCCASION_NAV_ITEMS: OccasionNavItem[] = [
  {
    key: "wedding",
    Icon: HeartIcon,
    href: appRoutes.marketing.useCase("wedding"),
    isCta: false,
  },
  {
    key: "birthday",
    Icon: GiftIcon,
    href: appRoutes.marketing.useCase("birthday"),
    isCta: false,
  },
  {
    key: "anniversary",
    Icon: SparkleIcon,
    href: appRoutes.marketing.useCase("anniversary"),
    isCta: false,
  },
  {
    key: "baby",
    Icon: StarIcon,
    href: appRoutes.marketing.useCase("baby-shower"),
    isCta: false,
  },
  {
    key: "corporate",
    Icon: UsersIcon,
    href: appRoutes.marketing.useCase("corporate"),
    isCta: false,
  },
  {
    key: "graduation",
    Icon: LaurelIcon,
    href: appRoutes.marketing.useCase("graduation"),
    isCta: false,
  },
  {
    key: "memorial",
    Icon: BookIcon,
    href: appRoutes.marketing.useCase("memorial"),
    isCta: false,
  },
  {
    key: "any",
    Icon: CalendarIcon,
    href: appRoutes.auth.role,
    isCta: true,
  },
];

export const occasionTitleKey = (key: string) =>
  `landing_general__occasions_${key}_title`;

export const occasionSubtitleKey = (key: string) =>
  `landing_general__occasions_${key}_subtitle`;
