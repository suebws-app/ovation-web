import { useTranslations } from "next-intl";

export const UnsupportedProductCard = () => {
  const t = useTranslations();
  return (
    <div className="rounded-20 border-border bg-card flex flex-col items-start gap-2 border p-6">
      <h2 className="type-h4 font-semibold">
        {t("keepsakes__unsupported_product__title")}
      </h2>
      <p className="type-body-small text-muted-foreground leading-relaxed">
        {t("keepsakes__unsupported_product__body")}
      </p>
    </div>
  );
};
