import Image from "next/image";
import { use } from "react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SparkleIcon } from "@ovation/icons/SparkleIcon";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import type { LocalePageProps } from "@/i18n/types";
import { appRoutes } from "@/lib/routes";
import { softwareApplicationSchema } from "@/lib/seo/schemas";
import { appUrl, localizedAbsoluteUrl } from "@/lib/seo/urls";
import { SectionTitle } from "../../../components/SectionTitle";
import { PageBreadcrumbJsonLd } from "../components/PageBreadcrumbJsonLd";
import { WeddingPlannerFaq } from "./WeddingPlannerFaq";
import { WeddingPlannerFeature } from "./WeddingPlannerFeature";
import {
  WEDDING_PLANNER_AI_EXAMPLE_KEYS,
  WEDDING_PLANNER_FEATURE_KEYS,
} from "./constants";

const SoftwareApplicationJsonLd = async ({ locale }: { locale: string }) => {
  const t = await getTranslations({ locale });
  const url = localizedAbsoluteUrl(locale, "/wedding-planner");
  const featureList = WEDDING_PLANNER_FEATURE_KEYS.map((f) => t(f.titleKey));

  return (
    <JsonLd
      data={softwareApplicationSchema({
        name: t("seo__wedding_planner__title"),
        description: t("seo__wedding_planner__description"),
        url,
        imageUrl: `${appUrl}/images/planner_dashboard.webp`,
        featureList,
      })}
    />
  );
};

export const WeddingPlannerPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  return (
    <>
      <PageBreadcrumbJsonLd
        locale={locale}
        page="wedding_planner"
        path="/wedding-planner"
      />
      <SoftwareApplicationJsonLd locale={locale} />

      <section>
        <div className="section-container">
          <div className="tablet:grid-cols-[1fr_1.1fr] tablet:gap-14 grid grid-cols-1 items-center gap-10">
            <div>
              <Kicker className="text-primary">
                {t("marketing__wedding_planner__eyebrow")}
              </Kicker>
              <SectionTitle
                as="h1"
                className="mt-4 leading-none tracking-tighter"
              >
                <span className="text-foreground block">
                  {t("marketing__wedding_planner__title_line1")}
                </span>
                <span className="text-primary block italic">
                  {t("marketing__wedding_planner__title_line2")}
                </span>
              </SectionTitle>
              <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
                {t("marketing__wedding_planner__description")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button variant="pillPrimary" size="pill" asChild>
                  <Link href={appRoutes.auth.role}>
                    {t("marketing__wedding_planner__cta_primary")}
                  </Link>
                </Button>
                <Button variant="pillGhost" size="pill" asChild>
                  <Link href={appRoutes.marketing.howItWorks}>
                    {t("marketing__wedding_planner__cta_secondary")}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-24 border-border relative aspect-2770/1582 w-full overflow-hidden border">
              <Image
                src="/images/planner_dashboard.webp"
                alt={t("marketing__wedding_planner__image_alt")}
                fill
                priority
                sizes="(min-width: 740px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">
            {t("marketing__wedding_planner__features_eyebrow")}
          </Kicker>
          <SectionTitle className="mt-4">
            {t("marketing__wedding_planner__features_title")}
          </SectionTitle>
          <div className="tablet:grid-cols-2 desktop:grid-cols-3 mt-10 grid grid-cols-1 gap-4">
            {WEDDING_PLANNER_FEATURE_KEYS.map((feature) => (
              <WeddingPlannerFeature
                key={feature.titleKey}
                Icon={feature.Icon}
                iconWrapClassName={feature.iconWrapClassName}
                iconClassName={feature.iconClassName}
                title={t(feature.titleKey)}
                body={t(feature.bodyKey)}
              />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <div className="rounded-24 bg-warm-cream tablet:p-14 p-8">
            <Kicker className="text-primary">
              {t("marketing__wedding_planner__ai_eyebrow")}
            </Kicker>
            <SectionTitle className="mt-4">
              {t("marketing__wedding_planner__ai_title")}
            </SectionTitle>
            <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
              {t("marketing__wedding_planner__ai_body")}
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-3">
              {WEDDING_PLANNER_AI_EXAMPLE_KEYS.map((key) => (
                <li
                  key={key}
                  className="border-border bg-card rounded-16 flex items-start gap-3 border p-4"
                >
                  <span className="bg-accent/25 text-accent mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
                    <SparkleIcon className="size-4" />
                  </span>
                  <span className="text-foreground type-body leading-relaxed">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <WeddingPlannerFaq />

      <section>
        <div className="section-container-small">
          <div className="rounded-24 bg-foreground tablet:p-14 p-8 text-center">
            <Kicker className="text-primary">
              {t("marketing__wedding_planner__final_cta_eyebrow")}
            </Kicker>
            <SectionTitle className="text-background mt-4">
              {t("marketing__wedding_planner__final_cta_title")}
            </SectionTitle>
            <p className="text-background/80 type-body-large mx-auto mt-6 max-w-130 leading-relaxed">
              {t("marketing__wedding_planner__final_cta_description")}
            </p>
            <Button variant="pillPrimary" size="pill" className="mt-8" asChild>
              <Link href={appRoutes.auth.role}>
                {t("marketing__wedding_planner__final_cta_button")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
