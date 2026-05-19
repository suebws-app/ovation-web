"use client";

import { useTranslations } from "next-intl";
import { PlansButton } from "@/features/plans";

type NudgeCardProps = {
  planTier: string | null;
  storageExpiresAt: string | null;
};

const daysUntil = (iso: string | null): number | null => {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
};

export const NudgeCard = ({ planTier, storageExpiresAt }: NudgeCardProps) => {
  const t = useTranslations();
  const isFree = !planTier;
  const days = daysUntil(storageExpiresAt);

  const title = isFree
    ? t("dashboard__nudge__free_title")
    : t("dashboard__nudge__paid_title");

  let description: string;
  if (isFree) {
    description = t("dashboard__nudge__free_description");
  } else if (storageExpiresAt === null) {
    description = t("dashboard__nudge__lifetime_description");
  } else if (days !== null) {
    description = t("dashboard__nudge__days_remaining", { days });
  } else {
    description = "";
  }

  return (
    <div className="rounded-16 border-primary/40 bg-primary/10 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6 flex flex-col gap-4 border p-5">
      <div className="rounded-12 bg-primary text-primary-foreground type-h3 flex size-12 shrink-0 items-center justify-center font-bold">
        ✦
      </div>
      <div className="flex-1">
        <p className="type-body-large font-serif font-semibold">{title}</p>
        <p className="type-body-small text-muted-foreground">{description}</p>
      </div>
      {isFree && (
        <PlansButton
          variant="outline"
          className="tablet:w-auto w-full bg-transparent"
        />
      )}
    </div>
  );
};
