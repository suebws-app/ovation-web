import { use } from "react";
import type { LocalePageProps } from "@/i18n/types";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionTitle } from "../../../components/SectionTitle";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Button } from "@ovation/ui/components/Button";
import { appRoutes } from "@/lib/routes";
import { Link } from "@/i18n/navigation";
import { locales } from "@/i18n/config";
import { GoldBookFeature } from "./GoldBookFeature";
import { GOLD_BOOK_FEATURE_KEYS } from "./constants";
import { PageBreadcrumbJsonLd } from "../components/PageBreadcrumbJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { productSchema } from "@/lib/seo/schemas";
import { localizedAbsoluteUrl } from "@/lib/seo/urls";

export const GoldBookPage = ({ params }: LocalePageProps) => {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  const features = GOLD_BOOK_FEATURE_KEYS.map((k) => ({
    title: t(k.title, { count: locales.length }),
    body: t(k.body),
  }));

  const goldBookUrl = localizedAbsoluteUrl(locale, "/gold-book");
  const goldBookProductJsonLd = productSchema({
    name: t("seo__gold_book__title"),
    description: t("seo__gold_book__description"),
    url: goldBookUrl,
  });

  return (
    <>
      <PageBreadcrumbJsonLd
        locale={locale}
        page="gold_book"
        path="/gold-book"
      />
      <JsonLd data={goldBookProductJsonLd} />
      <section>
        <div className="section-container-small">
          <Kicker className="text-primary">
            {t("marketing__gold_book__eyebrow")}
          </Kicker>
          <SectionTitle as="h1" className="mt-4 leading-none tracking-tighter">
            <span className="text-foreground block">
              {t("marketing__gold_book__title_line1")}
            </span>
            <span className="text-primary block italic">
              {t("marketing__gold_book__title_line2")}
            </span>
          </SectionTitle>
          <p className="text-muted-foreground type-body-large mt-6 max-w-130 leading-relaxed">
            {t("marketing__gold_book__description")}
          </p>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <div className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
            {features.map((f) => (
              <GoldBookFeature key={f.title} title={f.title} body={f.body} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-container-small">
          <Button size="lg" asChild>
            <Link href={appRoutes.auth.role}>
              {t("marketing__gold_book__cta")}
            </Link>
          </Button>
          <p className="text-muted-foreground type-body-small mt-4">
            {t("marketing__gold_book__ships_v2")}
          </p>
        </div>
      </section>
    </>
  );
};
