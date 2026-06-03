import { getTranslations } from "next-intl/server";
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
    <div>
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
          <div className="flex flex-row items-center justify-between">
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
          </div>
        )}
        {state === "cancellation_scheduled" && (
          <div className="flex flex-row items-start justify-between gap-4">
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
          </div>
        )}
      </div>
    </div>
  );
};
