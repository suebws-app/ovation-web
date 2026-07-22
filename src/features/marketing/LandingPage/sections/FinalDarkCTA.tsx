import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

export const FinalDarkCTA = () => {
  const t = useTranslations();

  return (
    <section className="theme-locked-light bg-foreground">
      <div className="section-container flex flex-col items-center text-center">
        <p className="landing-eyebrow text-primary">
          {t("marketing__landing_b__final_cta_eyebrow")}
        </p>
        <h2 className="landing-h1 tablet:landing-display small-desktop:landing-hero text-primary-foreground mx-auto mt-4 max-w-180">
          {t("marketing__landing_b__final_cta_title")}
        </h2>
        <p className="landing-body-large text-primary-foreground/70 mt-5 max-w-140">
          {t("marketing__landing_b__final_cta_description")}
        </p>
        <Button variant="pillPrimary" size="pill" className="mt-8" asChild>
          <Link href={appRoutes.auth.role}>
            {t("marketing__landing_b__final_cta_button")}
          </Link>
        </Button>
      </div>
    </section>
  );
};
