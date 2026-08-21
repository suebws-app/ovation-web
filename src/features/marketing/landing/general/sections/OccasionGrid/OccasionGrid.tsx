import { useTranslations } from "next-intl";
import { GENERAL_KEY_PREFIX } from "../../../variant";
import { OCCASION_CARDS } from "./constants";
import { OccasionCard } from "./OccasionCard";

export const OccasionGrid = () => {
  const t = useTranslations();
  const k = (suffix: string) => t(`${GENERAL_KEY_PREFIX}${suffix}`);

  return (
    <section className="bg-warm-cream">
      <div className="tablet:py-20 desktop:py-24 mx-auto w-full max-w-332 px-6 py-14">
        <div className="mx-auto flex max-w-160 flex-col items-center text-center">
          <h2 className="landing-h1 tablet:landing-display text-foreground">
            {k("occasions_title")}
          </h2>
          <p className="landing-body-large text-muted-foreground mt-5">
            {k("occasions_description")}
          </p>
        </div>

        <div className="tablet:grid-cols-2 small-desktop:grid-cols-3 tablet:mt-16 tablet:gap-x-12 mt-10 grid grid-cols-1 gap-x-8 gap-y-10">
          {OCCASION_CARDS.map((card) => (
            <OccasionCard
              key={card.key}
              Icon={card.Icon}
              href={card.href}
              title={k(`occasions_${card.key}_title`)}
              subtitle={k(`occasions_${card.key}_subtitle`)}
              linkLabel={
                card.isCta ? k("occasions_link_cta") : k("occasions_link_more")
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};
