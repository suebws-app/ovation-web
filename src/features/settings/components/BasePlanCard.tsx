import { getTranslations } from "next-intl/server";
import type { BasePlanInfo } from "@/lib/api/types";
import { formatLongDate } from "@/lib/utils/formatDate";

type BasePlanCardProps = {
  plan: BasePlanInfo;
  locale: string;
};

export const BasePlanCard = async ({ plan, locale }: BasePlanCardProps) => {
  const t = await getTranslations();
  return (
    <div className="rounded-16 border-border bg-card divide-border divide-y border">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="type-body-small text-muted-foreground">
          {t("settings__billing__base_plan_title")}
        </span>
        <span className="type-body font-medium">{plan.planName}</span>
      </div>
      {plan.expiresAt && (
        <div className="flex items-center justify-between px-6 py-4">
          <span className="type-body-small text-muted-foreground">
            {t("settings__billing__base_plan_expires_label")}
          </span>
          <span className="type-body font-medium">
            {formatLongDate(plan.expiresAt, locale)}
          </span>
        </div>
      )}
    </div>
  );
};
