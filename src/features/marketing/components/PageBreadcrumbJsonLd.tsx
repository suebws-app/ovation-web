import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/seo/schemas";
import { localizedAbsoluteUrl } from "@/lib/seo/urls";

interface PageBreadcrumbJsonLdProps {
  locale: string;
  page: string;
  path: string;
}

export const PageBreadcrumbJsonLd = async ({
  locale,
  page,
  path,
}: PageBreadcrumbJsonLdProps) => {
  const t = await getTranslations({ locale });
  return (
    <JsonLd
      data={breadcrumbListSchema([
        { name: "Ovation", url: localizedAbsoluteUrl(locale, "/") },
        {
          name: t(`seo__${page}__title`),
          url: localizedAbsoluteUrl(locale, path),
        },
      ])}
    />
  );
};
