"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";

export const NudgeCard = () => {
  const t = useTranslations();
  const icon = "✦";
  const onAction = () => {};

  return (
    <div className="rounded-16 border-accent/50 bg-accent/15 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6 flex flex-col gap-4 border p-5">
      <div className="rounded-12 bg-accent text-primary-foreground type-h3 flex size-12 shrink-0 items-center justify-center font-serif font-bold">
        {icon}
      </div>
      <div className="flex-1">
        <p className="type-body-large font-serif font-semibold">
          {t("dashboard__nudge__title")}
        </p>
        <p className="type-body-small text-muted-foreground">
          {t("dashboard__nudge__description")}
        </p>
      </div>
      <Button
        variant="outline"
        onClick={onAction}
        className="tablet:w-auto w-full rounded-full bg-transparent"
      >
        {t("dashboard__nudge__action")}
      </Button>
    </div>
  );
};
