import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Button } from "@ovation/ui/components/Button";
import { SectionTitle } from "@/components/SectionTitle";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { breadcrumbListSchema } from "@/lib/seo/schemas";
import { localizedAbsoluteUrl } from "@/lib/seo/urls";
import { findCompetitor } from "./competitors";
import { CompetitorFeatureRow } from "./CompetitorFeatureRow";

export type CompetitorPageVariant = "vs" | "alternatives";

interface CompetitorPageProps {
  params: Promise<{ locale: string; competitor: string }>;
  variant: CompetitorPageVariant;
}

const numberedRange = (count: number): number[] =>
  Array.from({ length: count }, (_, i) => i + 1);

export const CompetitorPage = async ({
  params,
  variant,
}: CompetitorPageProps) => {
  const { locale, competitor: competitorSlug } = await params;
  setRequestLocale(locale);

  const competitor = findCompetitor(competitorSlug);
  if (!competitor) notFound();

  const t = await getTranslations();
  const basePath = variant === "vs" ? "/vs" : "/alternatives";
  const canonicalUrl = localizedAbsoluteUrl(
    locale,
    `${basePath}/${competitor.slug}`,
  );

  const category = t(`marketing__vs__${competitor.slug}__category`);
  const tagline = t(`marketing__vs__${competitor.slug}__tagline`);
  const strengths = numberedRange(competitor.bulletCounts.strengths).map((n) =>
    t(`marketing__vs__${competitor.slug}__strength_${n}`),
  );
  const gaps = numberedRange(competitor.bulletCounts.gaps).map((n) =>
    t(`marketing__vs__${competitor.slug}__gap_${n}`),
  );
  const wins = numberedRange(competitor.bulletCounts.ovationWins).map((n) =>
    t(`marketing__vs__${competitor.slug}__win_${n}`),
  );

  const headline =
    variant === "vs"
      ? t("marketing__competitor__vs_headline", {
          competitor: competitor.name,
        })
      : t("marketing__competitor__alternatives_headline", {
          competitor: competitor.name,
        });

  const breadcrumbJsonLd = breadcrumbListSchema([
    { name: "Ovation", url: localizedAbsoluteUrl(locale, "/") },
    {
      name:
        variant === "vs"
          ? t("marketing__competitor__vs_breadcrumb")
          : t("marketing__competitor__alternatives_breadcrumb"),
      url: localizedAbsoluteUrl(locale, basePath),
    },
    { name: competitor.name, url: canonicalUrl },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">{category}</Kicker>
          <SectionTitle as="h1" className="mt-4 tracking-tighter">
            {headline}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href={appRoutes.auth.role}>
                {t("marketing__competitor__cta_primary")}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sample">
                {t("marketing__competitor__cta_secondary")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <h2 className="landing-h2 text-foreground">
            {t("marketing__competitor__where_wins", {
              competitor: competitor.name,
            })}
          </h2>
          <ul className="text-muted-foreground type-body mt-6 list-disc space-y-2 pl-6">
            {strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <h2 className="landing-h2 text-foreground">
            {t("marketing__competitor__where_gaps", {
              competitor: competitor.name,
            })}
          </h2>
          <ul className="text-muted-foreground type-body mt-6 list-disc space-y-2 pl-6">
            {gaps.map((gap) => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <h2 className="landing-h2 text-foreground">
            {t("marketing__competitor__ovation_wins")}
          </h2>
          <ul className="text-muted-foreground type-body mt-6 list-disc space-y-2 pl-6">
            {wins.map((win) => (
              <li key={win}>{win}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <h2 className="landing-h2 text-foreground">
            {t("marketing__competitor__feature_comparison")}
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[540px]">
              <thead>
                <tr>
                  <th className="type-body-small text-muted-foreground pr-4 pb-4 text-left font-medium tracking-wide uppercase" />
                  <th className="type-body-small text-foreground pr-4 pb-4 text-left font-semibold tracking-wide uppercase">
                    Ovation
                  </th>
                  <th className="type-body-small text-muted-foreground pb-4 text-left font-medium tracking-wide uppercase">
                    {competitor.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitor.features.map((feature) => (
                  <CompetitorFeatureRow
                    key={feature.labelKey}
                    feature={feature}
                    competitorName={competitor.name}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className="section-container-small text-center">
          <SectionTitle as="h2">
            {t("marketing__competitor__final_cta_title")}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mx-auto mt-4 max-w-130">
            {t("marketing__competitor__final_cta_body")}
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href={appRoutes.auth.role}>
              {t("marketing__competitor__cta_primary")}
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};
