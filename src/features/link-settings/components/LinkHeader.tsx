import { useTranslations } from "next-intl";

type LinkHeaderProps = {
  slug: string | null;
};

export const LinkHeader = ({ slug }: LinkHeaderProps) => {
  const t = useTranslations();
  const path = slug ? `/g/${slug}` : null;

  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="type-h2 font-semibold">{t("link_settings__title")}</h1>
      <p className="type-body-small text-muted-foreground">
        {t("link_settings__subtitle")}
      </p>
      {path && (
        <p className="type-caption text-muted-foreground truncate">{path}</p>
      )}
    </div>
  );
};
