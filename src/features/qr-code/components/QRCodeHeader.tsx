import { useTranslations } from "next-intl";
import { PageHeading } from "@/components/PageHeading";

export const QRCodeHeader = () => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-5">
      <div className="min-w-0">
        <PageHeading>
          {t("qr__header__title_a")}{" "}
          <span className="text-primary italic">
            {t("qr__header__title_b")}
          </span>
        </PageHeading>
        <p className="type-body-small text-muted-foreground mt-2 max-w-130 leading-relaxed">
          {t("qr__header__subtitle")}
        </p>
      </div>
    </div>
  );
};
