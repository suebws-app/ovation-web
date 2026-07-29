import Image from "next/image";
import { useTranslations } from "next-intl";
import { ClipboardCheckIcon } from "@ovation/icons/ClipboardCheckIcon";
import { RouteIcon } from "@ovation/icons/RouteIcon";
import { SparkleIcon } from "@ovation/icons/SparkleIcon";
import { StoreIcon } from "@ovation/icons/StoreIcon";
import { UserPlusIcon } from "@ovation/icons/UserPlusIcon";
import { WalletIcon } from "@ovation/icons/WalletIcon";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { PlannerPillar } from "./PlannerPillar";

const PILLARS = [
  {
    Icon: RouteIcon,
    titleKey: "marketing__landing_b__planner_pillar_timeline_title",
    bodyKey: "marketing__landing_b__planner_pillar_timeline_body",
    iconWrapClassName: "bg-primary/15",
    iconClassName: "text-primary",
  },
  {
    Icon: ClipboardCheckIcon,
    titleKey: "marketing__landing_b__planner_pillar_tasks_title",
    bodyKey: "marketing__landing_b__planner_pillar_tasks_body",
    iconWrapClassName: "bg-secondary/20",
    iconClassName: "text-secondary",
  },
  {
    Icon: WalletIcon,
    titleKey: "marketing__landing_b__planner_pillar_budget_title",
    bodyKey: "marketing__landing_b__planner_pillar_budget_body",
    iconWrapClassName: "bg-accent/25",
    iconClassName: "text-accent",
  },
  {
    Icon: UserPlusIcon,
    titleKey: "marketing__landing_b__planner_pillar_guests_title",
    bodyKey: "marketing__landing_b__planner_pillar_guests_body",
    iconWrapClassName: "bg-primary/15",
    iconClassName: "text-primary",
  },
  {
    Icon: StoreIcon,
    titleKey: "marketing__landing_b__planner_pillar_vendors_title",
    bodyKey: "marketing__landing_b__planner_pillar_vendors_body",
    iconWrapClassName: "bg-secondary/20",
    iconClassName: "text-secondary",
  },
  {
    Icon: SparkleIcon,
    titleKey: "marketing__landing_b__planner_pillar_ai_title",
    bodyKey: "marketing__landing_b__planner_pillar_ai_body",
    iconWrapClassName: "bg-accent/25",
    iconClassName: "text-accent",
  },
] as const;

export const WeddingPlannerSection = () => {
  const t = useTranslations();

  return (
    <section id="planner" className="bg-warm-cream">
      <div className="section-container">
        <div className="tablet:grid-cols-2 grid grid-cols-1 items-center gap-14">
          <div className="rounded-24 tablet:order-1 relative order-2 aspect-2770/1582 w-full overflow-hidden">
            <Image
              src="/images/planner_dashboard.webp"
              alt={t("marketing__landing_b__planner_image_alt")}
              fill
              sizes="(min-width: 740px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="tablet:order-2 order-1">
            <p className="landing-eyebrow text-primary">
              {t("marketing__landing_b__planner_eyebrow")}
            </p>
            <h2 className="landing-h2 tablet:landing-h1 text-foreground mt-3">
              {t("marketing__landing_b__planner_title")}
            </h2>
            <p className="landing-body-large text-muted-foreground mt-5">
              {t("marketing__landing_b__planner_subtitle")}
            </p>
            <Button variant="pillPrimary" size="pill" className="mt-6" asChild>
              <Link href={appRoutes.marketing.weddingPlanner}>
                {t("marketing__landing_b__planner_cta_primary")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-border tablet:grid-cols-3 mt-16 grid grid-cols-2 border-t">
          {PILLARS.map((pillar) => (
            <PlannerPillar
              key={pillar.titleKey}
              Icon={pillar.Icon}
              iconWrapClassName={pillar.iconWrapClassName}
              iconClassName={pillar.iconClassName}
              title={t(pillar.titleKey)}
              description={t(pillar.bodyKey)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
