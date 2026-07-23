import { getTranslations, setRequestLocale } from "next-intl/server";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Button } from "@ovation/ui/components/Button";
import { SectionTitle } from "@/components/SectionTitle";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { PageBreadcrumbJsonLd } from "../components/PageBreadcrumbJsonLd";
import { AudienceBullet } from "./AudienceBullet";
import type { AudienceKey } from "./audiences";
import { findAudiencePage } from "./audiences";

interface AudienceLandingPageProps {
  audienceKey: AudienceKey;
  params: Promise<{ locale: string }>;
}

export const AudienceLandingPage = async ({
  audienceKey,
  params,
}: AudienceLandingPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = findAudiencePage(audienceKey);
  if (!content) return null;

  const t = await getTranslations();
  const bullets = content.bulletKeys.map((key) => ({ key, text: t(key) }));

  return (
    <>
      <PageBreadcrumbJsonLd
        locale={locale}
        page={content.seoPage}
        path={content.path}
      />

      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">{t(content.eyebrowKey)}</Kicker>
          <SectionTitle as="h1" className="mt-4 tracking-tighter">
            {t(content.titleKey)}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t(content.subtitleKey)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href={appRoutes.auth.role}>{t(content.ctaPrimaryKey)}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sample">{t(content.ctaSecondaryKey)}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <ul className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
            {bullets.map((bullet) => (
              <AudienceBullet key={bullet.key} text={bullet.text} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};
