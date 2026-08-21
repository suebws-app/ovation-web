import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { GENERAL2_PREFIX, PLANNER_PILLARS } from "../constants";
import { PlannerPillarCard } from "./PlannerPillarCard";
import { PlanTheEventAnimation } from "./PlanTheEventAnimation";

export const PlannerSection = () => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL2_PREFIX}${suffix}`);

  return (
    <section id="planner" className="bg-warm-panel/40">
      <div className="section-container">
        <div className="desktop:grid-cols-2 grid grid-cols-1 items-center gap-14">
          <div className="order-2 w-full">
            <PlanTheEventAnimation showCaption={false} />
          </div>
          <div className="desktop:order-2">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground type-caption rounded-full px-3 py-1 font-semibold tracking-wide uppercase">
                {k("planner_badge")}
              </span>
              <p className="landing-eyebrow text-primary">
                {k("planner_eyebrow")}
              </p>
            </div>
            <h2 className="landing-h1 tablet:landing-display text-foreground mt-4">
              {k("planner_title")}
            </h2>
            <p className="landing-body-large text-muted-foreground mt-5">
              {k("planner_subtitle")}
            </p>
            <Button variant="pillPrimary" size="pill" className="mt-6" asChild>
              <Link href={appRoutes.marketing.weddingPlanner}>
                {k("planner_cta")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="tablet:grid-cols-3 mt-10 grid grid-cols-1 gap-4">
          {PLANNER_PILLARS.map((pillar) => (
            <PlannerPillarCard
              key={pillar.titleSuffix}
              Icon={pillar.Icon}
              iconClassName={pillar.iconClassName}
              iconWrapClassName={pillar.iconWrapClassName}
              title={k(pillar.titleSuffix)}
              body={k(pillar.bodySuffix)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
