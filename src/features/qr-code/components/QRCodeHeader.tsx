import { useTranslations } from "next-intl";

export const QRCodeHeader = () => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-5">
      <div className="min-w-0">
        <h1 className="tablet:type-h1 type-h1 leading-tight font-semibold tracking-tight">
          {t("qr__header__title_a")}{" "}
          <span className="text-primary italic">
            {t("qr__header__title_b")}
          </span>
        </h1>
        <p className="type-body-small text-muted-foreground mt-2 max-w-130 leading-relaxed">
          {t("qr__header__subtitle")}
        </p>
      </div>
    </div>
  );
};
