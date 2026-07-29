import type { ComponentType, SVGProps } from "react";
import { ClipboardCheckIcon } from "@ovation/icons/ClipboardCheckIcon";
import { RouteIcon } from "@ovation/icons/RouteIcon";
import { SparkleIcon } from "@ovation/icons/SparkleIcon";
import { StoreIcon } from "@ovation/icons/StoreIcon";
import { UserPlusIcon } from "@ovation/icons/UserPlusIcon";
import { WalletIcon } from "@ovation/icons/WalletIcon";

export type WeddingPlannerFeatureKey = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  titleKey: string;
  bodyKey: string;
  iconWrapClassName: string;
  iconClassName: string;
};

export const WEDDING_PLANNER_FEATURE_KEYS: readonly WeddingPlannerFeatureKey[] =
  [
    {
      Icon: RouteIcon,
      titleKey: "marketing__wedding_planner__feature_timeline_title",
      bodyKey: "marketing__wedding_planner__feature_timeline_body",
      iconWrapClassName: "bg-primary/15",
      iconClassName: "text-primary",
    },
    {
      Icon: ClipboardCheckIcon,
      titleKey: "marketing__wedding_planner__feature_tasks_title",
      bodyKey: "marketing__wedding_planner__feature_tasks_body",
      iconWrapClassName: "bg-secondary/20",
      iconClassName: "text-secondary",
    },
    {
      Icon: WalletIcon,
      titleKey: "marketing__wedding_planner__feature_budget_title",
      bodyKey: "marketing__wedding_planner__feature_budget_body",
      iconWrapClassName: "bg-accent/25",
      iconClassName: "text-accent",
    },
    {
      Icon: UserPlusIcon,
      titleKey: "marketing__wedding_planner__feature_guests_title",
      bodyKey: "marketing__wedding_planner__feature_guests_body",
      iconWrapClassName: "bg-primary/15",
      iconClassName: "text-primary",
    },
    {
      Icon: StoreIcon,
      titleKey: "marketing__wedding_planner__feature_vendors_title",
      bodyKey: "marketing__wedding_planner__feature_vendors_body",
      iconWrapClassName: "bg-secondary/20",
      iconClassName: "text-secondary",
    },
    {
      Icon: SparkleIcon,
      titleKey: "marketing__wedding_planner__feature_ai_title",
      bodyKey: "marketing__wedding_planner__feature_ai_body",
      iconWrapClassName: "bg-accent/25",
      iconClassName: "text-accent",
    },
  ] as const;

export const WEDDING_PLANNER_FAQ_KEYS = [
  {
    q: "marketing__wedding_planner__faq_1_q",
    a: "marketing__wedding_planner__faq_1_a",
  },
  {
    q: "marketing__wedding_planner__faq_2_q",
    a: "marketing__wedding_planner__faq_2_a",
  },
  {
    q: "marketing__wedding_planner__faq_3_q",
    a: "marketing__wedding_planner__faq_3_a",
  },
  {
    q: "marketing__wedding_planner__faq_4_q",
    a: "marketing__wedding_planner__faq_4_a",
  },
  {
    q: "marketing__wedding_planner__faq_5_q",
    a: "marketing__wedding_planner__faq_5_a",
  },
] as const;

export const WEDDING_PLANNER_AI_EXAMPLE_KEYS = [
  "marketing__wedding_planner__ai_example_1",
  "marketing__wedding_planner__ai_example_2",
  "marketing__wedding_planner__ai_example_3",
] as const;
