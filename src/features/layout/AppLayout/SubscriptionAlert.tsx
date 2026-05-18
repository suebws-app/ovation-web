import { useTranslations } from "next-intl";
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@ovation/ui/components/Alert";
import { Button } from "@ovation/ui/components/Button";
import { InfoIcon } from "@ovation/icons/InfoIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { Subscription } from "@/lib/api/types";

type SubscriptionAlertProps = {
  subscription: Subscription | null;
  planTier: string | null;
};

export const SubscriptionAlert = ({
  subscription,
  planTier,
}: SubscriptionAlertProps) => {
  const t = useTranslations();

  if (planTier) return null;
  if (subscription && subscription.status === "active") return null;

  return (
    <div className="max-w-container mx-auto w-full px-6 pt-2">
      <Alert>
        <InfoIcon />
        <AlertTitle>{t("app__no_subscription__title")}</AlertTitle>
        <AlertDescription>
          {t("app__no_subscription__description")}
        </AlertDescription>
        <AlertAction>
          <Button asChild size="sm">
            <Link href={appRoutes.app.plans}>
              {t("app__no_subscription__cta")}
            </Link>
          </Button>
        </AlertAction>
      </Alert>
    </div>
  );
};
