import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { SectionTitle } from "../../../components/SectionTitle";
import { PricingCard } from "./PricingCard";
import { PRICES, TIERS } from "./constants";

export const PricingSection = () => {
  const t = useTranslations();

  return (
    <section className="bg-card border-border border-t">
      <div className="section-container">
        <div className="mb-14 text-center">
          <Kicker className="text-muted-foreground mb-4">
            {t("marketing__pricing__eyebrow")}
          </Kicker>
          <SectionTitle>{t("marketing__pricing__title")}</SectionTitle>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
            {t("marketing__pricing__subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
          {TIERS.map((tier) => (
            <PricingCard
              key={tier.key}
              tierKey={tier.key}
              highlighted={tier.highlighted}
              tagKey={tier.tagKey}
              nameKey={tier.nameKey}
              priceKey={tier.priceKey}
              perKey={tier.perKey}
              descKey={tier.descKey}
              ctaKey={tier.ctaKey}
              featKeys={tier.featKeys}
              price={PRICES[tier.key]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
