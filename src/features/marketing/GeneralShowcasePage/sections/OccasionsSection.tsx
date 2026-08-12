import { useTranslations } from "next-intl";
import { GENERAL2_PREFIX, OCCASIONS } from "../constants";
import { OccasionCard } from "./OccasionCard";

export const OccasionsSection = () => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL2_PREFIX}${suffix}`);

  return (
    <section id="occasions" className="section-container scroll-mt-20">
      <div className="mx-auto mb-11 max-w-165 text-center">
        <p className="landing-eyebrow text-secondary-strong mb-3.5">
          {k("occ_tag")}
        </p>
        <h2 className="landing-h1 tablet:landing-display text-foreground">
          {k("occ_title")}
        </h2>
        <p className="landing-body-large text-muted-foreground mt-4">
          {k("occ_lede")}
        </p>
      </div>

      <div className="tablet:grid-cols-2 desktop:grid-cols-4 grid grid-cols-1 gap-4">
        {OCCASIONS.map((occasion) => (
          <OccasionCard
            key={occasion.key}
            Icon={occasion.Icon}
            iconWrapClassName={occasion.iconWrapClassName}
            imageSrc={occasion.imageSrc}
            title={k(occasion.titleSuffix)}
            body={k(occasion.bodySuffix)}
            wide={occasion.wide}
          />
        ))}
      </div>
    </section>
  );
};
