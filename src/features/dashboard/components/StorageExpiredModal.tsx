"use client";

import { Dialog } from "radix-ui";
import { useState, useSyncExternalStore, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { paymentsClient } from "@/lib/api/payments-client";

const DISMISS_KEY = "storage-expired-modal-dismissed";
const GRACE_DAYS = 30;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

type StorageExpiredModalProps = {
  storageExpiresAt: string | null;
  planTier: string | null;
};

const computeDaysLeft = (expiresAt: string): number | null => {
  const expiredMs = Date.now() - new Date(expiresAt).getTime();
  if (expiredMs <= 0) return null;
  const daysExpired = Math.floor(expiredMs / MS_PER_DAY);
  if (daysExpired >= GRACE_DAYS) return null;
  return GRACE_DAYS - daysExpired;
};

const shouldShow = (
  storageExpiresAt: string | null,
  planTier: string | null,
): number | null => {
  if (!storageExpiresAt) return null;
  if (planTier === "storage_extension") return null;
  return computeDaysLeft(storageExpiresAt);
};

const noopSubscribe = () => () => {};
const useClientReady = (): boolean =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

export const StorageExpiredModal = ({
  storageExpiresAt,
  planTier,
}: StorageExpiredModalProps) => {
  const t = useTranslations();
  const ready = useClientReady();
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const daysLeft = ready ? shouldShow(storageExpiresAt, planTier) : null;
  const sessionDismissed =
    ready && typeof window !== "undefined"
      ? window.sessionStorage.getItem(DISMISS_KEY) === "1"
      : false;
  const open = ready && daysLeft !== null && !dismissed && !sessionDismissed;

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    }
    setDismissed(true);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) handleDismiss();
  };

  const handleActivate = () => {
    setError(null);
    startTransition(async () => {
      try {
        const origin = window.location.origin;
        const checkout = await paymentsClient.createDreCheckoutSession({
          successUrl: `${origin}/checkout/{CHECKOUT_SESSION_ID}/success`,
          cancelUrl: `${origin}/checkout/{CHECKOUT_SESSION_ID}/cancel`,
        });
        window.location.assign(checkout.checkoutUrl);
      } catch {
        setError(t("storage_expired_modal__error_generic"));
      }
    });
  };

  if (daysLeft === null) return null;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-foreground/40 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="bg-card rounded-16 tablet:p-8 fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 p-6 shadow-lg"
        >
          <Dialog.Title className="type-h3 font-serif">
            {t("storage_expired_modal__title")}
          </Dialog.Title>
          <Dialog.Description asChild>
            <p className="type-body text-muted-foreground">
              {t("storage_expired_modal__body", { days: daysLeft })}
            </p>
          </Dialog.Description>
          {error && <p className="type-body-small text-destructive">{error}</p>}
          <div className="tablet:flex-row mt-2 flex flex-col-reverse gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={handleDismiss}
              disabled={pending}
            >
              {t("storage_expired_modal__dismiss_cta")}
            </Button>
            <Button
              type="button"
              variant="default"
              className="rounded-full"
              onClick={handleActivate}
              disabled={pending}
            >
              {t("storage_expired_modal__activate_cta")}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
