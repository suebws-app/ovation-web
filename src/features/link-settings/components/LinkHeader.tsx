import { useTranslations } from "next-intl";
import { PageHeading } from "@/components/PageHeading";

export const LinkHeader = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-1.5">
      <PageHeading>{t("link_settings__title")}</PageHeading>
      <p className="type-body-small text-muted-foreground">
        {t("link_settings__subtitle")}
      </p>
    </div>
  );
};
