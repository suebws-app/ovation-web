"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

type SubscriptionAlertProps = {
  planTier: string | null;
};

export const SubscriptionAlert = ({ planTier }: SubscriptionAlertProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  if (planTier !== "free") return null;
  if (pathname.startsWith(appRoutes.app.plans)) return null;

  return (
    <div className="max-w-container mx-auto w-full px-6 pt-2">
      <div className="rounded-16 border-primary/40 bg-primary/10 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6 flex flex-col gap-4 border p-5">
        <div className="rounded-12 bg-primary text-primary-foreground type-h3 flex size-12 shrink-0 items-center justify-center font-bold">
          ✦
        </div>
        <div className="flex-1">
          <p className="type-body-large font-serif font-semibold">
            {t("app__no_subscription__title")}
          </p>
          <p className="type-body-small text-muted-foreground">
            {t("app__no_subscription__description")}
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="tablet:w-auto w-full rounded-full bg-transparent"
        >
          <Link href={appRoutes.app.plans}>
            {t("app__no_subscription__cta")}
          </Link>
        </Button>
      </div>
    </div>
  );
};
