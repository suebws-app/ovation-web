import { getTranslations } from "next-intl/server";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { MySubscription } from "@/lib/api/types";
import { CancelSubscriptionButton } from "./CancelSubscriptionButton";

const formatDate = (iso: string | null, locale: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

type CurrentSubscriptionCardProps = {
  subscription: MySubscription;
  locale: string;
};

export const CurrentSubscriptionCard = async ({
  subscription,
  locale,
}: CurrentSubscriptionCardProps) => {
  const t = await getTranslations();

  const periodLabel = subscription.cancelAtPeriodEnd
    ? t("settings__billing__access_ends_label")
    : t("settings__billing__pro_renews");

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-16 border-border bg-card divide-border divide-y border">
        <div className="flex items-center justify-between px-6 py-4">
          <span className="type-body-small text-muted-foreground">
            {t("settings__billing__pro_plan")}
          </span>
          <span className="type-body font-medium">{subscription.planName}</span>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <span className="type-body-small text-muted-foreground">
            {t("settings__billing__pro_status")}
          </span>
          <span className="type-body font-medium capitalize">
            {subscription.cancelAtPeriodEnd
              ? t("settings__billing__cancel_scheduled_badge")
              : subscription.status}
          </span>
        </div>
        {subscription.currentPeriodEnd && (
          <div className="flex items-center justify-between px-6 py-4">
            <span className="type-body-small text-muted-foreground">
              {periodLabel}
            </span>
            <span className="type-body font-medium">
              {formatDate(subscription.currentPeriodEnd, locale)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="default" size="sm" className="rounded-full">
          <Link href={appRoutes.app.plans}>
            {t("settings__billing__upgrade_btn")}
          </Link>
        </Button>
        <CancelSubscriptionButton
          cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
          periodEnd={subscription.currentPeriodEnd}
          locale={locale}
        />
      </div>
    </div>
  );
};
