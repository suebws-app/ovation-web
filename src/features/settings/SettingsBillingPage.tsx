import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { ApiError } from "@/lib/api/client";
import { appRoutes } from "@/lib/routes";
import { CurrentSubscriptionCard } from "./components/CurrentSubscriptionCard";
import { SubscriptionHistoryTable } from "./components/SubscriptionHistoryTable";

const safeGetMine = () =>
  subscriptionsApi.getMine().catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    return null;
  });

const safeGetHistory = () =>
  subscriptionsApi
    .getMyHistory()
    .catch(() => ({ items: [] }));

export const SettingsBillingPage = async () => {
  const t = await getTranslations();
  const locale = await getLocale();
  const user = await getCurrentUser();
  if (!user) redirect(appRoutes.auth.signIn);

  const [mineResult, historyResult] = await Promise.all([
    safeGetMine(),
    safeGetHistory(),
  ]);

  const subscription = mineResult?.subscription ?? null;
  const items = historyResult.items;

  if (!subscription && items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="type-body text-muted-foreground">
          {t("settings__billing__no_sub")}
        </p>
        <Button asChild variant="default" size="sm" className="rounded-full">
          <Link href={`${appRoutes.app.plans}?upgrade=1`}>
            {t("settings__billing__upgrade_btn")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {subscription && (
        <CurrentSubscriptionCard subscription={subscription} locale={locale} />
      )}
      <SubscriptionHistoryTable items={items} locale={locale} />
    </div>
  );
};
