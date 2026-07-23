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
import { findUseCase } from "./useCases";
import { UseCaseStep } from "./UseCaseStep";
import { UseCaseFaqItem } from "./UseCaseFaqItem";

interface UseCasePageProps {
  params: Promise<{ locale: string; case: string }>;
}

const numberedRange = (count: number): number[] =>
  Array.from({ length: count }, (_, i) => i + 1);

export const UseCasePage = async ({ params }: UseCasePageProps) => {
  const { locale, case: caseSlug } = await params;
  setRequestLocale(locale);

  const useCase = findUseCase(caseSlug);
  if (!useCase) notFound();

  const t = await getTranslations();
  const canonicalUrl = localizedAbsoluteUrl(
    locale,
    `/use-cases/${useCase.slug}`,
  );

  const base = `marketing__use_case__${useCase.slug}`;
  const title = t(`${base}__title`);
  const subtitle = t(`${base}__subtitle`);
  const eyebrow = t(`${base}__eyebrow`);
  const problem = t(`${base}__problem`);
  const solution = t(`${base}__solution`);

  const steps = numberedRange(useCase.stepCount).map((n) => ({
    key: `${useCase.slug}-step-${n}`,
    text: t(`${base}__step_${n}`),
    index: n,
  }));

  const faqItems = numberedRange(useCase.faqCount).map((n) => ({
    key: `${useCase.slug}-faq-${n}`,
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
          <Kicker className="text-primary">{eyebrow}</Kicker>
          <SectionTitle as="h1" className="mt-4 tracking-tighter">
            {title}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href={appRoutes.auth.role}>
                {t("marketing__use_case__cta_primary")}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sample">
                {t("marketing__use_case__cta_secondary")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <h2 className="landing-h2 text-foreground">
            {t("marketing__use_case__problem_heading")}
          </h2>
          <p className="text-muted-foreground type-body mt-4 leading-relaxed">
            {problem}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <h2 className="landing-h2 text-foreground">
            {t("marketing__use_case__solution_heading")}
          </h2>
          <p className="text-muted-foreground type-body mt-4 leading-relaxed">
            {solution}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <h2 className="landing-h2 text-foreground">
            {t("marketing__use_case__steps_heading")}
          </h2>
          <ol className="mt-6 space-y-4">
            {steps.map((step) => (
              <UseCaseStep key={step.key} index={step.index} text={step.text} />
            ))}
          </ol>
        </div>
      </section>

      {faqItems.length > 0 ? (
        <section>
          <div className="section-container-small">
            <h2 className="landing-h2 text-foreground">
              {t("marketing__use_case__faq_heading")}
            </h2>
            <dl className="mt-8 space-y-6">
              {faqItems.map((item) => (
                <UseCaseFaqItem
                  key={item.key}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </dl>
          </div>
        </section>
      ) : null}
    </>
  );
};
