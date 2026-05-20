"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";

const FREE_STORAGE_DAYS = 180;

type SubscriptionAlertProps = {
  planTier: string | null;
  storageExpiresAt: string | null;
  userCreatedAt: string | null;
};

const daysBetween = (ms: number) =>
  Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));

export const SubscriptionAlert = ({
  planTier,
  storageExpiresAt,
  userCreatedAt,
}: SubscriptionAlertProps) => {
  const t = useTranslations();
  const pathname = usePathname();

  if (pathname.startsWith(appRoutes.app.plans)) return null;
  if (planTier === "storage_extension") return null;

  const isFree = !planTier || planTier === "free";
  const isLifetime = !isFree && storageExpiresAt === null;

  let daysLeft: number | null = null;
  if (storageExpiresAt) {
    daysLeft = daysBetween(new Date(storageExpiresAt).getTime() - Date.now());
  } else if (isFree && userCreatedAt) {
    const elapsedDays = Math.floor(
      (Date.now() - new Date(userCreatedAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    daysLeft = Math.max(0, FREE_STORAGE_DAYS - elapsedDays);
  }

  const planNameMap: Record<string, string> = {
    premium: t("plan_name__premium"),
    bundle: t("plan_name__bundle"),
  };
  const title = isFree
    ? t("app__no_subscription__title")
    : planNameMap[planTier ?? ""] ?? t("app__plan__active_title");
  const description = isFree
    ? t("app__no_subscription__description")
    : t("app__plan__dre_upsell_description");
  const ctaLabel = isFree
    ? t("app__no_subscription__cta")
    : t("app__plan__dre_upsell_cta");
  const ctaHref = isFree
    ? appRoutes.app.plans
    : `${appRoutes.app.plans}?upgrade=1`;

  return (
    <div className="max-w-container mx-auto w-full px-6 pt-2">
      <div className="rounded-16 border-primary/40 bg-primary/10 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6 flex flex-col gap-4 border p-5">
        <div className="rounded-12 bg-primary text-primary-foreground type-h3 flex size-12 shrink-0 items-center justify-center font-bold">
          ✦
        </div>
        <div className="flex-1">
          <p className="type-overline text-primary tracking-[2px]">
            {t("plan_status__current_plan_eyebrow")}
          </p>
          <p className="type-body-large font-serif font-semibold mt-1">{title}</p>
          <p className="type-body-small text-muted-foreground">{description}</p>
          <div className="type-body-small text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
            {daysLeft !== null && (
              <span>{t("plan_status__days_left", { days: daysLeft })}</span>
            )}
            {isLifetime && <span>{t("plan_status__lifetime")}</span>}
          </div>
        </div>
        <Button
          asChild
          variant="outline"
          className="tablet:w-auto w-full rounded-full bg-transparent"
        >
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  );
};
