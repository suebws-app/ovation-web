import { useTranslations } from "next-intl";

export const LinkHeader = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="type-h2 font-semibold">{t("link_settings__title")}</h1>
      <p className="type-body-small text-muted-foreground">
        {t("link_settings__subtitle")}
      </p>
    </div>
  );
};
