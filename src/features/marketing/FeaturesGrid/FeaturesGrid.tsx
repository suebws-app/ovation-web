import { useTranslations } from "next-intl";
import { Badge } from "@ovation/ui/components/Badge";
import { Kicker } from "@ovation/ui/components/Kicker";
import { LockIcon } from "@ovation/icons/LockIcon";
import { SectionTitle } from "../../../components/SectionTitle";
import { FeatureCard } from "./FeatureCard";
import { GoldBookPrice } from "./GoldBookPrice";
import {
  REMAINING_LANGUAGE_COUNT,
  TOTAL_LANGUAGE_COUNT,
  VISIBLE_LANGUAGES,
} from "./constants";

type FeaturesGridProps = {
  goldBookPrice: string;
};

export const FeaturesGrid = ({ goldBookPrice }: FeaturesGridProps) => {
  const t = useTranslations();

  return (
    <section>
      <div className="section-container">
        <div className="mb-12 flex flex-col items-center">
          <Kicker className="text-primary mb-4">
            {t("marketing__features__eyebrow")}
          </Kicker>
          <SectionTitle className="mx-auto max-w-205 text-center leading-tight">
            {t("marketing__features__title_line1")}{" "}
            <span className="text-primary italic">
              {t("marketing__features__title_line2")}
            </span>
          </SectionTitle>
        </div>

        <div className="grid grid-cols-1 gap-4.5 md:grid-cols-4">
          <FeatureCard
            kicker={t("marketing__features__lang_eyebrow")}
            kickerClassName="text-destructive"
            title={t("marketing__features__lang_title", {
              count: TOTAL_LANGUAGE_COUNT,
            })}
            titleClassName="type-h2 tablet:type-h1"
            className="bg-destructive/10 md:col-span-2"
          >
            <div className="mt-2 mb-3 flex flex-wrap gap-2">
              {VISIBLE_LANGUAGES.map((lang) => (
                <Badge key={lang} variant="outline">
                  {lang}
                </Badge>
              ))}
              {REMAINING_LANGUAGE_COUNT > 0 && (
                <Badge variant="outline">+{REMAINING_LANGUAGE_COUNT}</Badge>
              )}
            </div>
          </FeatureCard>

          <FeatureCard
            kicker={t("marketing__features__book_eyebrow")}
            kickerClassName="text-accent"
            title={t("marketing__features__book_title")}
            className="bg-accent/15"
          >
            <div className="mt-auto flex items-center gap-3">
              <div className="from-accent to-accent/70 flex h-20 w-15 items-center justify-center rounded-r-lg bg-linear-to-br shadow-md">
                <span className="text-primary-foreground type-h2 font-bold">
                  O
                </span>
              </div>
              <div>
                <GoldBookPrice fallbackPrice={goldBookPrice} />
                <p className="text-muted-foreground type-caption">
                  {t("marketing__features__book_shipping_v2")}
                </p>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            kicker={t("marketing__features__privacy_eyebrow")}
            kickerClassName="text-secondary"
            title={t("marketing__features__privacy_title")}
            className="bg-secondary/15"
          >
            <div className="text-muted-foreground type-caption mt-auto flex items-center gap-2">
              <LockIcon className="size-3.5 shrink-0" />
              <span>{t("marketing__features__privacy_detail")}</span>
            </div>
          </FeatureCard>

          <FeatureCard
            kicker={t("marketing__features__invites_eyebrow")}
            kickerClassName="text-primary"
            title={t("marketing__features__invites_title")}
            className="bg-primary/10 md:col-span-2"
          >
            <p className="text-muted-foreground type-body-small mt-auto">
              {t("marketing__features__invites_body")}
            </p>
          </FeatureCard>

          <FeatureCard
            kicker={t("marketing__features__gallery_eyebrow")}
            kickerClassName="text-destructive"
            title={t("marketing__features__gallery_title")}
            className="bg-destructive/10 md:col-span-2"
          >
            <p className="text-muted-foreground type-body-small mt-auto">
              {t("marketing__features__gallery_body")}
            </p>
          </FeatureCard>

          <FeatureCard
            kicker={t("marketing__features__kiosk_eyebrow")}
            kickerClassName="text-muted-foreground"
            title={t("marketing__features__kiosk_title")}
            className="bg-muted/40 md:col-span-4"
          >
            <p className="text-muted-foreground type-body-small mt-auto">
              {t("marketing__features__kiosk_body")}
            </p>
          </FeatureCard>

          <FeatureCard
            kicker={t("marketing__features__planner_eyebrow")}
            kickerClassName="text-primary"
            title={t("marketing__features__planner_title_v2")}
            titleClassName="type-h2 mb-3"
            className="bg-primary/10 md:col-span-4"
          >
            <p className="text-muted-foreground type-body-small">
              {t("marketing__features__planner_body_v2")}
            </p>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};
