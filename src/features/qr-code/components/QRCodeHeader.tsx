"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";

export const QRCodeHeader = () => {
  const t = useTranslations();
  return (
    <div className="desktop:flex-row desktop:items-end desktop:justify-between flex flex-col gap-5">
      <div className="min-w-0">
        <h1 className="tablet:type-h1 type-h1 font-serif leading-tight font-semibold tracking-tight">
          {t("qr__header__title_a")}{" "}
          <span className="text-primary italic">
            {t("qr__header__title_b")}
          </span>
        </h1>
        <p className="type-body-small text-muted-foreground mt-2 max-w-130 leading-relaxed">
          {t("qr__header__subtitle")}
        </p>
      </div>
      <div className="desktop:flex hidden shrink-0 gap-2">
        <Button variant="outline" className="rounded-full whitespace-nowrap">
          {t("qr__header__preview")}
        </Button>
        <Button className="shadow-primary/40 rounded-full whitespace-nowrap shadow-md">
          {t("qr__header__order_cards")}
        </Button>
      </div>
    </div>
  );
};
