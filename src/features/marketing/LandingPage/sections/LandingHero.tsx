import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { HeroMosaic } from "./HeroMosaic";
import { ScrollToSectionButton } from "./ScrollToSectionButton";

export const LandingHero = () => {
  const t = useTranslations();

  return (
    <section className="bg-warm-cream">
      <div className="section-container grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.02fr]">
        <div className="flex flex-col">
          <p className="landing-eyebrow text-primary">
            {t("marketing__landing_b__hero_eyebrow")}
          </p>
          <h1 className="landing-h1 tablet:landing-display small-desktop:landing-hero text-foreground mt-6">
            <span>{t("marketing__landing_b__hero_title_line1")}</span>{" "}
            <span className="text-primary italic">
              {t("marketing__landing_b__hero_title_line2")}
            </span>
          </h1>
          <p className="landing-body-large text-muted-foreground mt-6 max-w-125">
            {t("marketing__landing_b__hero_description")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="pillPrimary" size="pill" asChild>
              <Link href={appRoutes.auth.role}>
                {t("marketing__landing_b__cta_primary")}
              </Link>
            </Button>
            <ScrollToSectionButton targetId="product">
              {t("marketing__landing_b__cta_secondary")}
            </ScrollToSectionButton>
          </div>
        </div>

        <HeroMosaic />
      </div>
    </section>
  );
};
