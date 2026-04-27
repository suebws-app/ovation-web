import { getTranslations } from "next-intl/server";
import { Mic } from "@ovation/icons/Mic";
import { Camera } from "@ovation/icons/Camera";
import { ArrowRight } from "@ovation/icons/ArrowRight";
import { LandingStepCard } from "./LandingStepCard";

export const LandingSteps = async () => {
  const t = await getTranslations();
  return (
    <div>
      <p className="type-overline text-muted-foreground mb-2.5 px-0.5">
        {t("guest__landing__steps_eyebrow")}
      </p>
      <div className="flex flex-col gap-2.5">
        <LandingStepCard
          index={1}
          title={t("guest__landing__step_one_title")}
          subtitle={t("guest__landing__step_one_subtitle")}
          icon={<Mic width={18} height={18} />}
          iconClassName="bg-primary"
        />
        <LandingStepCard
          index={2}
          title={t("guest__landing__step_two_title")}
          subtitle={t("guest__landing__step_two_subtitle")}
          icon={<Camera width={18} height={18} />}
          iconClassName="bg-destructive"
        />
        <LandingStepCard
          index={3}
          title={t("guest__landing__step_three_title")}
          subtitle={t("guest__landing__step_three_subtitle")}
          icon={<ArrowRight width={18} height={18} />}
          iconClassName="bg-secondary"
        />
      </div>
    </div>
  );
};
