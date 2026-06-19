"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@ovation/ui/components/Button";
import { subscriptionsClient } from "@/lib/api/subscriptions-client";
import { formatLongDate } from "@/lib/utils/formatDate";

type CancelSubscriptionButtonProps = {
  cancelAtPeriodEnd: boolean;
  periodEnd: string | null;
  locale: string;
};

export const CancelSubscriptionButton = ({
  cancelAtPeriodEnd,
  periodEnd,
  locale,
}: CancelSubscriptionButtonProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      try {
        if (cancelAtPeriodEnd) {
          await subscriptionsClient.dreResume();
        } else {
          await subscriptionsClient.dreCancel();
        }
        setOpen(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common__error"));
      }
    });
  };

  const title = cancelAtPeriodEnd
    ? t("settings__billing__resume_confirm_title")
    : t("settings__billing__cancel_confirm_title");
  const body = cancelAtPeriodEnd
    ? t("settings__billing__resume_confirm_body")
    : t("settings__billing__cancel_confirm_body", {
        date: formatLongDate(periodEnd, locale),
      });
  const action = cancelAtPeriodEnd
    ? t("settings__billing__resume_confirm_action")
    : t("settings__billing__cancel_confirm_action");
  const trigger = cancelAtPeriodEnd
    ? t("settings__billing__resume_btn")
    : t("settings__billing__cancel_btn");

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        {trigger}
      </Button>

      {open && (
        <div className="bg-foreground/45 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="rounded-20 bg-card w-full max-w-lg p-9 shadow-lg">
            <h2 className="type-h2 leading-snug tracking-tight">{title}</h2>
            <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
              {body}
            </p>

            {error && (
              <p className="type-body-small text-destructive mt-3">{error}</p>
            )}

            <div className="mt-6.5 flex justify-end gap-2.5">
              <Button
                variant="outline"
                className="min-w-56 rounded-full"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                {t("settings__billing__dismiss")}
              </Button>
              <Button
                variant={cancelAtPeriodEnd ? "default" : "destructive"}
                className="min-w-56 rounded-full"
                onClick={handleConfirm}
                disabled={pending}
              >
                {pending && (
                  <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {action}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
