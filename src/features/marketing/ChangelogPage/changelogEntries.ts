import { appRoutes } from "@/lib/routes";

export type ChangelogCategoryKey =
  | "marketing__changelog__category_feature"
  | "marketing__changelog__category_improvement"
  | "marketing__changelog__category_fix";

export type ChangelogEntry = {
  slug: string;
  dateKey: string;
  categoryKey: ChangelogCategoryKey;
  titleKey: string;
  descriptionKey: string;
  highlightKeys: string[];
  cta?: {
    labelKey: string;
    href: string;
  };
  image?: {
    src: string;
    altKey: string;
    width: number;
    height: number;
  };
};

export const CHANGELOG_ENTRIES: readonly ChangelogEntry[] = [
  {
    slug: "ai-wedding-planner",
    dateKey: "marketing__changelog__entry_ai_planner__date",
    categoryKey: "marketing__changelog__category_feature",
    titleKey: "marketing__changelog__entry_ai_planner__title",
    descriptionKey: "marketing__changelog__entry_ai_planner__description",
    highlightKeys: [
      "marketing__changelog__entry_ai_planner__highlight_1",
      "marketing__changelog__entry_ai_planner__highlight_2",
      "marketing__changelog__entry_ai_planner__highlight_3",
      "marketing__changelog__entry_ai_planner__highlight_4",
      "marketing__changelog__entry_ai_planner__highlight_5",
      "marketing__changelog__entry_ai_planner__highlight_6",
    ],
    cta: {
      labelKey: "marketing__changelog__entry_ai_planner__cta",
      href: appRoutes.marketing.weddingPlanner,
    },
    image: {
      src: "/images/planner_dashboard.webp",
      altKey: "marketing__changelog__entry_ai_planner__image_alt",
      width: 2770,
      height: 1582,
    },
  },
] as const;
