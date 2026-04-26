"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Play } from "@ovation/icons/Play";

export const KioskFooter = () => {
  const t = useTranslations();
  return (
    <div className="flex items-center justify-between">
      <span className="type-caption text-muted-foreground">
        {t("kiosk__footer__autosave")}
      </span>
      <div className="flex gap-2.5">
        <Button variant="outline" className="rounded-full">
          {t("kiosk__footer__save_template")}
        </Button>
        <Button className="rounded-full shadow-lg">
          <Play width={13} height={13} />
          {t("kiosk__footer__start")}
        </Button>
      </div>
    </div>
  );
};
