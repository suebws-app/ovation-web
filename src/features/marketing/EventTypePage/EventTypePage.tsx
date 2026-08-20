import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Button } from "@ovation/ui/components/Button";
import { SectionTitle } from "@/components/SectionTitle";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { breadcrumbListSchema, faqPageSchema } from "@/lib/seo/schemas";
import { localizedAbsoluteUrl } from "@/lib/seo/urls";
import { FaqAccordion } from "@/features/marketing/components/FaqAccordion";
import { FeatureGrid } from "@/features/marketing/landing/general/sections/FeatureGrid";
import { HowItWorksSteps } from "@/features/marketing/landing/general/sections/HowItWorksSteps";
import { FinalDarkCTA } from "@/features/marketing/landing/sections/FinalDarkCTA";
import { GENERAL_KEY_PREFIX } from "@/features/marketing/landing/variant";
import { findEventTypePage } from "./eventTypePages";
import { EventTypeBenefit } from "./EventTypeBenefit";

interface EventTypePageProps {
  params: Promise<{ locale: string; case: string }>;
}

const numberedRange = (count: number): number[] =>
  Array.from({ length: count }, (_, i) => i + 1);

export const EventTypePage = async ({ params }: EventTypePageProps) => {
  const { locale, case: slug } = await params;
  setRequestLocale(locale);

  const page = findEventTypePage(slug);
  if (!page) notFound();

  const t = await getTranslations();
  const canonicalUrl = localizedAbsoluteUrl(locale, `/use-cases/${page.slug}`);

  const base = `marketing__event_type__${page.slug}`;
  const variantPrefix = `${base}__`;
  const title = t(`${base}__title`);
  const subtitle = t(`${base}__subtitle`);
  const problem = t(`${base}__problem`);
  const solution = t(`${base}__solution`);
  const heroAlt = t(`${base}__hero_alt`);
  const introAlt = t(`${base}__intro_alt`);
  const eyebrow = t.has(`${base}__eyebrow`)
    ? t(`${base}__eyebrow`)
    : t(`et__${page.eventType}__name`);

  const benefits = numberedRange(page.benefitCount).map((n) => ({
    key: `${page.slug}-benefit-${n}`,
    title: t(`${base}__benefit_${n}_title`),
    body: t(`${base}__benefit_${n}_body`),
  }));

  const faqItems = numberedRange(page.faqCount).map((n) => ({
    key: `${page.slug}-faq-${n}`,
    question: t(`${base}__faq_${n}_q`),
    answer: t(`${base}__faq_${n}_a`),
  }));

  const breadcrumbJsonLd = breadcrumbListSchema([
    { name: "Ovation", url: localizedAbsoluteUrl(locale, "/") },
    {
      name: t("marketing__use_case__breadcrumb"),
      url: localizedAbsoluteUrl(locale, "/use-cases"),
    },
    { name: title, url: canonicalUrl },
  ]);

  const faqJsonLd = faqPageSchema(
    faqItems.map((item) => ({ q: item.question, a: item.answer })),
  );

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      <section>
        <div className="section-container-small">
          <div className="desktop:grid-cols-2 desktop:items-center grid grid-cols-1 gap-10">
            <div>
              <Kicker className="text-primary">{eyebrow}</Kicker>
              <SectionTitle as="h1" className="mt-4 tracking-tighter">
                {title}
              </SectionTitle>
              <p className="text-muted-foreground type-body-large mt-6 leading-relaxed">
                {subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href={appRoutes.auth.role}>
                    {t("marketing__event_type__cta_primary")}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={appRoutes.marketing.sample}>
                    {t("marketing__event_type__cta_secondary")}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-24 relative aspect-4/3 w-full overflow-hidden">
              <Image
                src={page.heroImage}
                alt={heroAlt}
                fill
                priority
                sizes="(min-width: 1200px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <div className="desktop:grid-cols-2 desktop:items-center grid grid-cols-1 gap-10">
            <div className="rounded-24 desktop:order-1 relative order-2 aspect-4/3 w-full overflow-hidden">
              <Image
                src={page.introImage}
                alt={introAlt}
                fill
                sizes="(min-width: 1200px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="desktop:order-2 order-1">
              <h2 className="landing-h2 text-foreground">
                {t("marketing__event_type__problem_heading")}
              </h2>
              <p className="text-muted-foreground type-body mt-4 leading-relaxed">
                {problem}
              </p>
              <h2 className="landing-h2 text-foreground mt-10">
                {t("marketing__event_type__solution_heading")}
              </h2>
              <p className="text-muted-foreground type-body mt-4 leading-relaxed">
                {solution}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <h2 className="landing-h2 text-foreground">
            {t("marketing__event_type__benefits_heading")}
          </h2>
          <div className="tablet:grid-cols-3 mt-8 grid grid-cols-1 gap-6">
            {benefits.map((benefit) => (
              <EventTypeBenefit
                key={benefit.key}
                title={benefit.title}
                body={benefit.body}
              />
            ))}
          </div>
        </div>
      </section>

      <HowItWorksSteps keyPrefix={variantPrefix} />

      <FeatureGrid keyPrefix={variantPrefix} />

      <section>
        <div className="section-container-small">
          <h2 className="landing-h2 text-foreground">
            {t("marketing__event_type__faq_heading")}
          </h2>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      <FinalDarkCTA keyPrefix={GENERAL_KEY_PREFIX} />
    </>
  );
};
