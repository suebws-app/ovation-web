import { getTranslations } from "next-intl/server";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { DreInfo } from "@/lib/api/types";
import { CancelSubscriptionButton } from "./CancelSubscriptionButton";
import { DreCancelIntentLink } from "./DreCancelIntentLink";

const formatDate = (iso: string | null, locale: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

type DreSectionProps = {
  dre: DreInfo | null;
  basePlanExpiresAt: string | null;
  locale: string;
};

export const DreSection = async ({
  dre,
  basePlanExpiresAt,
  locale,
}: DreSectionProps) => {
  const t = await getTranslations();
  const state = dre?.state ?? "none";

  return (
    <div className="rounded-16 border-border bg-card flex flex-col gap-4 border p-6">
      <h2 className="type-heading-small">
        {t("settings__billing__dre_title")}
      </h2>
      {(state === "none" || state === "expired") && (
        <>
          <p className="type-body-small text-muted-foreground">
            {t("settings__billing__dre_cta_body", {
              date: formatDate(basePlanExpiresAt, locale),
            })}
          </p>
          <Button asChild variant="default" size="sm" className="rounded-full">
            <Link href={`${appRoutes.app.plans}?upgrade=1`}>
              {t("settings__billing__dre_activate_btn")}
            </Link>
          </Button>
        </>
      )}
      {state === "pending" && (
        <>
          <p className="type-body-small text-muted-foreground">
            {t("settings__billing__dre_pending_body", {
              date: formatDate(basePlanExpiresAt, locale),
            })}
          </p>
          <DreCancelIntentLink
            label={t("settings__billing__dre_cancel_intent_btn")}
          />
        </>
      )}
      {state === "active" && (
        <>
          <p className="type-body-small text-muted-foreground">
            {t("settings__billing__dre_active_body", {
              date: formatDate(dre?.currentPeriodEnd ?? null, locale),
            })}
          </p>
          <CancelSubscriptionButton
            cancelAtPeriodEnd={false}
            periodEnd={dre?.currentPeriodEnd ?? null}
            locale={locale}
          />
        </>
      )}
      {state === "cancellation_scheduled" && (
        <>
          <p className="type-body-small text-muted-foreground">
            {t("settings__billing__dre_cancellation_scheduled_body", {
              date: formatDate(dre?.currentPeriodEnd ?? null, locale),
            })}
          </p>
          <CancelSubscriptionButton
            cancelAtPeriodEnd={true}
            periodEnd={dre?.currentPeriodEnd ?? null}
            locale={locale}
          />
        </>
      )}
    </div>
  );
};
