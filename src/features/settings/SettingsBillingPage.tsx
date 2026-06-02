import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { ApiError } from "@/lib/api/client";
import { appRoutes } from "@/lib/routes";
import { BasePlanCard } from "./components/BasePlanCard";
import { DreSection } from "./components/DreSection";
import { SubscriptionHistoryTable } from "./components/SubscriptionHistoryTable";

const safeOverview = () =>
  subscriptionsApi.getMine().catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    return null;
  });

const safeHistory = () =>
  subscriptionsApi.getMyHistory().catch(() => ({ items: [] }));

export const SettingsBillingPage = async () => {
  const t = await getTranslations();
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) redirect(appRoutes.auth.signIn);

  const [overview, history] = await Promise.all([
    safeOverview(),
    safeHistory(),
  ]);

  const basePlan = overview?.basePlan ?? null;
  const dre = overview?.dre ?? null;
  const items = history.items;

  const dreActiveOrScheduled =
    dre?.state === "active" || dre?.state === "cancellation_scheduled";

  if (!basePlan && !dreActiveOrScheduled && items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="type-body text-muted-foreground">
          {t("settings__billing__no_sub")}
        </p>
        <Button asChild variant="default" size="sm" className="rounded-full">
          <Link href={`${appRoutes.app.plans}`}>
            {t("settings__billing__upgrade_btn")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {basePlan && <BasePlanCard plan={basePlan} locale={locale} />}
      {user.accountType !== "pro" && (basePlan || dreActiveOrScheduled) && (
        <DreSection
          dre={dre}
          basePlanExpiresAt={basePlan?.expiresAt ?? dre?.currentPeriodEnd ?? null}
          locale={locale}
        />
      )}
      <SubscriptionHistoryTable items={items} locale={locale} />
    </div>
  );
};
