import { getTranslations } from "next-intl/server";

export const LinkEmpty = async () => {
  const t = await getTranslations();
  return (
    <div className="rounded-16 border-border bg-card flex flex-col items-center justify-center gap-2 border p-12 text-center">
      <p className="type-h3 font-semibold">
        {t("link_settings__empty__title")}
      </p>
      <p className="type-body-small text-muted-foreground">
        {t("link_settings__empty__body")}
      </p>
    </div>
  );
};
