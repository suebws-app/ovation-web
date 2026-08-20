import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { SectionTitle } from "@/components/SectionTitle";
import { ForProsFeatureCard } from "./ForProsFeatureCard";
import { PRO_FEATURES } from "./constants";

export const ForProsFeatures = () => {
  const t = useTranslations();

  return (
    <section className="bg-card border-border border-t">
      <div className="section-container">
        <div className="mx-auto mb-12 flex max-w-180 flex-col items-center text-center">
          <Kicker className="text-primary">
            {t("marketing__for_pros__features_eyebrow")}
          </Kicker>
          <SectionTitle as="h2" className="mt-4">
            {t("marketing__for_pros__features_title")}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-4 leading-relaxed">
            {t("marketing__for_pros__features_subtitle")}
          </p>
        </div>

        <div className="tablet:grid-cols-3 grid grid-cols-1 gap-10">
          {PRO_FEATURES.map(({ key, imageSrc }) => (
            <ForProsFeatureCard
              key={key}
              title={t(`marketing__for_pros__feature__${key}__title`)}
              body={t(`marketing__for_pros__feature__${key}__body`)}
              imageSrc={imageSrc}
              imageAlt={t(`marketing__for_pros__feature__${key}__title`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
