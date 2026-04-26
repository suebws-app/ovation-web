"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Check } from "@ovation/icons/Check";
import { BatchAction } from "./BatchAction";

type BatchBarProps = {
  count: number;
  total: number;
};

export const BatchBar = ({ count, total }: BatchBarProps) => {
  const t = useTranslations();
  if (count === 0) return null;

  const actions = [
    t("photos__batch__action_download"),
    t("photos__batch__action_favourite"),
    t("photos__batch__action_tag"),
    t("photos__batch__action_pair"),
  ];

  return (
    <div className="border-border bg-foreground text-background tablet:px-4.5 flex items-center gap-3 border-b px-4 py-2.5">
      <div className="rounded-4 bg-secondary flex size-5 items-center justify-center">
        <Check
          width={13}
          height={13}
          className="text-foreground"
          strokeWidth={2.5}
        />
      </div>
      <span className="type-body-small font-semibold">
        {t("photos__batch__selected", { count })}
      </span>
      <span className="type-caption opacity-65">
        {t("photos__batch__of_total", { total })}
      </span>
      <div className="desktop:flex ml-auto hidden gap-1.5">
        {actions.map((label) => (
          <BatchAction key={label} label={label} />
        ))}
        <Button size="sm" className="rounded-full">
          {t("photos__batch__use_in_book")}
        </Button>
      </div>
    </div>
  );
};
