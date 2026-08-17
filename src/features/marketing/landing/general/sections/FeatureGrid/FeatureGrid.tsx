import { useTranslations } from "next-intl";
import { GENERAL_KEY_PREFIX } from "../../../variant";
import { FEATURE_GRID_ITEMS } from "./constants";
import { FeatureGridCard } from "./FeatureGridCard";

export const FeatureGrid = () => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL_KEY_PREFIX}${suffix}`);

  return (
    <section className="bg-background">
      <div className="tablet:py-20 desktop:py-24 mx-auto w-full max-w-332 px-6 py-14">
        <div className="mx-auto flex max-w-160 flex-col items-center text-center">
          <h2 className="landing-h1 tablet:landing-display text-foreground">
            {k("grid_title")}
          </h2>
          <p className="landing-body-large text-muted-foreground mt-5">
            {k("grid_description")}
          </p>
        </div>

        <div className="tablet:grid-cols-2 small-desktop:grid-cols-4 tablet:mt-16 mt-10 grid grid-cols-1 gap-5">
          {FEATURE_GRID_ITEMS.map((item) => (
            <FeatureGridCard
              key={item.key}
              Icon={item.Icon}
              title={k(`grid_${item.key}_title`)}
              description={k(`grid_${item.key}_description`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
