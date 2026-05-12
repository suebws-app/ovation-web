import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { ApiError } from "@/lib/api/client";
import { redirect } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import { ManageBillingButton } from "./components/ManageBillingButton";

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const SettingsBillingPage = async () => {
  const t = await getTranslations();
  const user = await getCurrentUser();
  if (!user) redirect(appRoutes.auth.signIn);

  if (user.accountType !== "pro") {
    return (
      <div className="type-body text-muted-foreground">
        {t("settings__billing__no_sub")}
      </div>
    );
  }

  const subResult = await subscriptionsApi.getMyPro().catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    return null;
  });
  const subscription = subResult?.subscription ?? null;

  if (!subscription) {
    return (
      <div className="type-body text-muted-foreground">
        {t("settings__billing__no_sub")}
      </div>
    );
  }

  const periodKey =
    subscription.status === "trialing"
      ? "settings__billing__pro_trial_ends"
      : "settings__billing__pro_renews";

  const periodDate =
    subscription.status === "cancelled"
      ? null
      : subscription.currentPeriodEnd;

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
            {subscription.status}
          </span>
        </div>
        {periodDate && (
          <div className="flex items-center justify-between px-6 py-4">
            <span className="type-body-small text-muted-foreground">
              {t(periodKey)}
            </span>
            <span className="type-body font-medium">
              {formatDate(periodDate)}
            </span>
          </div>
        )}
      </div>

      <ManageBillingButton label={t("settings__billing__manage_btn")} />
    </div>
  );
};
