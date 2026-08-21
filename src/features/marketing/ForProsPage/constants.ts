import { CameraIcon } from "@ovation/icons/CameraIcon";
import { MicIcon } from "@ovation/icons/MicIcon";
import { ClipboardCheckIcon } from "@ovation/icons/ClipboardCheckIcon";
import { StoreIcon } from "@ovation/icons/StoreIcon";
import { UsersIcon } from "@ovation/icons/UsersIcon";
import { SparkleIcon } from "@ovation/icons/SparkleIcon";

export type ProBusiness = {
  key: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
};

export const PRO_BUSINESSES: ProBusiness[] = [
  { key: "photography", Icon: CameraIcon },
  { key: "production", Icon: MicIcon },
  { key: "planning", Icon: ClipboardCheckIcon },
  { key: "venue", Icon: StoreIcon },
  { key: "corporate", Icon: UsersIcon },
  { key: "other", Icon: SparkleIcon },
];

export type ProFeature = {
  key: string;
  imageSrc: string;
};

export const PRO_FEATURES: ProFeature[] = [
  { key: "dashboard", imageSrc: "/images/planner_dashboard.webp" },
  { key: "qr_cards", imageSrc: "/images/qr_code.webp" },
  { key: "branding", imageSrc: "/images/laptop_dashboard.webp" },
];

export const businessLabelKey = (key: string) =>
  `marketing__for_pros__business__${key}__label`;

export const businessTitleKey = (key: string) =>
  `marketing__for_pros__business__${key}__title`;

export const businessBodyKey = (key: string) =>
  `marketing__for_pros__business__${key}__body`;

export const PRICING_ANCHOR = "pro-pricing";
