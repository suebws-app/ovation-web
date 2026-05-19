"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@ovation/ui/components/Button";
import { subscriptionsClient } from "@/lib/api/subscriptions-client";

type CancelSubscriptionButtonProps = {
  cancelAtPeriodEnd: boolean;
  periodEnd: string | null;
  locale: string;
};

const formatDate = (iso: string | null, locale: string) =>
  iso
    ? new Date(iso).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

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
          await subscriptionsClient.resume();
        } else {
          await subscriptionsClient.cancel();
        }
        setOpen(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "error");
      }
    });
  };

  const title = cancelAtPeriodEnd
    ? t("settings__billing__resume_confirm_title")
    : t("settings__billing__cancel_confirm_title");
  const body = cancelAtPeriodEnd
    ? t("settings__billing__resume_confirm_body")
    : t("settings__billing__cancel_confirm_body", {
        date: formatDate(periodEnd, locale),
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
                className="rounded-full"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                {t("settings__billing__cancel_keep_action")}
              </Button>
              <Button
                variant={cancelAtPeriodEnd ? "default" : "destructive"}
                className="rounded-full"
                onClick={handleConfirm}
                disabled={pending}
              >
                {action}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
