import { getTranslations, setRequestLocale } from "next-intl/server";
import { Kicker } from "@ovation/ui/components/Kicker";
import { SectionTitle } from "@/components/SectionTitle";
import { clientEnv } from "@/lib/utils/env.client";
import type { LocalePageProps } from "@/i18n/types";
import { PageBreadcrumbJsonLd } from "../components/PageBreadcrumbJsonLd";
import { MediaResourceLink } from "./MediaResourceLink";

const RESOURCE_KEYS = [
  "marketing__media__brand_assets",
  "marketing__media__product_shots",
  "marketing__media__founder_bios",
  "marketing__media__factsheet",
  "marketing__media__quotes",
] as const;

export const MediaPage = async ({ params }: LocalePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const resources = RESOURCE_KEYS.map((key) => ({ key, label: t(key) }));

  return (
    <>
      <PageBreadcrumbJsonLd
        locale={locale}
        page="for_media"
        path="/for-media"
      />

      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">
            {t("marketing__media__eyebrow")}
          </Kicker>
          <SectionTitle as="h1" className="mt-4 tracking-tighter">
            {t("marketing__media__title")}
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__media__subtitle")}
          </p>
          <p className="text-muted-foreground type-body mt-6">
            {t("marketing__media__contact_label")}:{" "}
            <a
              href={`mailto:${clientEnv.SUPPORT_EMAIL}`}
              className="text-primary underline"
            >
              {clientEnv.SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <ul className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
            {resources.map((resource) => (
              <MediaResourceLink key={resource.key} label={resource.label} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};
