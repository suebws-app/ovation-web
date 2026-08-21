import type { ComponentType } from "react";
import { HeartIcon } from "@ovation/icons/HeartIcon";
import { GiftIcon } from "@ovation/icons/GiftIcon";
import { StarIcon } from "@ovation/icons/StarIcon";
import { FlagIcon } from "@ovation/icons/FlagIcon";
import { BookIcon } from "@ovation/icons/BookIcon";
import { UsersIcon } from "@ovation/icons/UsersIcon";
import { RouteIcon } from "@ovation/icons/RouteIcon";
import { ClipboardCheckIcon } from "@ovation/icons/ClipboardCheckIcon";
import { WalletIcon } from "@ovation/icons/WalletIcon";
import { UserPlusIcon } from "@ovation/icons/UserPlusIcon";
import { StoreIcon } from "@ovation/icons/StoreIcon";
import { SparkleIcon } from "@ovation/icons/SparkleIcon";

export const GENERAL2_PREFIX = "landing_general2__";

type IconComponent = ComponentType<{ className?: string }>;

export type OccasionData = {
  key: string;
  Icon: IconComponent;
  iconWrapClassName: string;
  imageSrc: string;
  titleSuffix: string;
  bodySuffix: string;
  wide?: boolean;
};

export const OCCASIONS: OccasionData[] = [
  {
    key: "wed",
    Icon: HeartIcon,
    iconWrapClassName: "bg-primary text-primary-foreground",
    imageSrc: "/images/general/gen-wedding.webp",
    titleSuffix: "occ_wed_title",
    bodySuffix: "occ_wed_body",
  },
  {
    key: "anni",
    Icon: HeartIcon,
    iconWrapClassName: "bg-secondary text-foreground",
    imageSrc: "/images/general/gen-anniversary.jpg",
    titleSuffix: "occ_anni_title",
    bodySuffix: "occ_anni_body",
  },
  {
    key: "baby",
    Icon: StarIcon,
    iconWrapClassName: "bg-primary-soft text-foreground",
    imageSrc: "/images/general/gen-baby.png",
    titleSuffix: "occ_baby_title",
    bodySuffix: "occ_baby_body",
  },
  {
    key: "bday",
    Icon: GiftIcon,
    iconWrapClassName: "bg-primary text-primary-foreground",
    imageSrc: "/images/general/gen-birthday.jpg",
    titleSuffix: "occ_bday_title",
    bodySuffix: "occ_bday_body",
  },
  {
    key: "grad",
    Icon: FlagIcon,
    iconWrapClassName: "bg-secondary text-foreground",
    imageSrc: "/images/general/gen-graduation.jpg",
    titleSuffix: "occ_grad_title",
    bodySuffix: "occ_grad_body",
    wide: true,
  },
  {
    key: "mem",
    Icon: BookIcon,
    iconWrapClassName: "bg-secondary-soft text-secondary-strong",
    imageSrc: "/images/general/gen-memorial.avif",
    titleSuffix: "occ_mem_title",
    bodySuffix: "occ_mem_body",
  },
  {
    key: "corp",
    Icon: UsersIcon,
    iconWrapClassName: "bg-card text-foreground",
    imageSrc: "/images/general/gen-corporate.jpg",
    titleSuffix: "occ_corp_title",
    bodySuffix: "occ_corp_body",
  },
];

export type PlannerPillarData = {
  Icon: IconComponent;
  iconClassName: string;
  iconWrapClassName: string;
  titleSuffix: string;
  bodySuffix: string;
};

export const PLANNER_PILLARS: PlannerPillarData[] = [
  {
    Icon: RouteIcon,
    iconClassName: "text-primary",
    iconWrapClassName: "bg-primary/15",
    titleSuffix: "planner_timeline_title",
    bodySuffix: "planner_timeline_body",
  },
  {
    Icon: ClipboardCheckIcon,
    iconClassName: "text-secondary-strong",
    iconWrapClassName: "bg-secondary-soft",
    titleSuffix: "planner_tasks_title",
    bodySuffix: "planner_tasks_body",
  },
  {
    Icon: WalletIcon,
    iconClassName: "text-primary",
    iconWrapClassName: "bg-primary/15",
    titleSuffix: "planner_budget_title",
    bodySuffix: "planner_budget_body",
  },
  {
    Icon: UserPlusIcon,
    iconClassName: "text-secondary-strong",
    iconWrapClassName: "bg-secondary-soft",
    titleSuffix: "planner_guests_title",
    bodySuffix: "planner_guests_body",
  },
  {
    Icon: StoreIcon,
    iconClassName: "text-primary",
    iconWrapClassName: "bg-primary/15",
    titleSuffix: "planner_vendors_title",
    bodySuffix: "planner_vendors_body",
  },
  {
    Icon: SparkleIcon,
    iconClassName: "text-secondary-strong",
    iconWrapClassName: "bg-secondary-soft",
    titleSuffix: "planner_ai_title",
    bodySuffix: "planner_ai_body",
  },
];

export type AlbumData = {
  captionSuffix: string;
  imageSrc: string;
  spanClassName: string;
};

export const ALBUMS: AlbumData[] = [
  {
    captionSuffix: "alb1_cap",
    imageSrc: "/images/general/gen-wedding-party.webp",
    spanClassName: "tablet:col-span-2 tablet:row-span-2",
  },
  {
    captionSuffix: "alb2_cap",
    imageSrc: "/images/general/gen-birthday.jpg",
    spanClassName: "tablet:col-span-2",
  },
  {
    captionSuffix: "alb3_cap",
    imageSrc: "/images/general/gen-baby.png",
    spanClassName: "tablet:col-span-2 tablet:row-span-2",
  },
  {
    captionSuffix: "alb4_cap",
    imageSrc: "/images/general/gen-graduation.jpg",
    spanClassName: "tablet:col-span-2",
  },
  {
    captionSuffix: "alb5_cap",
    imageSrc: "/images/general/gen-anniversary.jpg",
    spanClassName: "tablet:col-span-3",
  },
  {
    captionSuffix: "alb6_cap",
    imageSrc: "/images/general/gen-corporate.jpg",
    spanClassName: "tablet:col-span-3",
  },
];
