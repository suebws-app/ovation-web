"use client";

import { useEffect, useState, useTransition } from "react";
import { Dialog } from "radix-ui";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { plansClient } from "@/lib/api/plans-client";
import { paymentsClient } from "@/lib/api/payments-client";
import type { Plan } from "@/lib/api/types";

type DrePlanModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formatPrice = (cents: number, currency: string): string =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);

export const DrePlanModal = ({ open, onOpenChange }: DrePlanModalProps) => {
  const t = useTranslations();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || plan) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    plansClient
      .list()
      .then((res) => {
        if (cancelled) return;
        const drePlan =
          res.plans.find((p) => p.code === "storage_extension") ?? null;
        if (!drePlan) {
          setError(t("dre_modal__error"));
        } else {
          setPlan(drePlan);
        }
      })
      .catch(() => {
        if (!cancelled) setError(t("dre_modal__error"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, plan, t]);

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
        setError(t("dre_modal__error"));
      }
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-foreground/40 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="bg-card rounded-16 tablet:p-8 data-[state=closed]:animate-scale-fade-out data-[state=open]:animate-scale-fade-in fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 p-6 shadow-lg"
        >
          <p className="type-overline text-primary tracking-[2px]">
            {t("dre_modal__eyebrow")}
          </p>
          <Dialog.Title className="type-h3 font-serif">
            {plan?.name ?? t("dre_modal__title")}
          </Dialog.Title>
          <Dialog.Description asChild>
            <p className="type-body text-muted-foreground">
              {t("plans__dre__description")}
            </p>
          </Dialog.Description>

          {loading && (
            <p className="type-body-small text-muted-foreground">
              {t("dre_modal__loading")}
            </p>
          )}

          {plan && (
            <p className="type-h2 font-serif">
              {formatPrice(plan.priceCents, plan.currency)}
              <span className="type-body-small text-muted-foreground ml-1.5 font-sans">
                {t("plans__dre__per_month")}
              </span>
            </p>
          )}

          {error && (
            <p className="type-body-small text-destructive">{error}</p>
          )}

          <div className="tablet:flex-row mt-2 flex flex-col-reverse gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              {t("dre_modal__cancel")}
            </Button>
            <Button
              type="button"
              variant="default"
              className="rounded-full"
              onClick={handleActivate}
              disabled={pending || loading || !plan}
            >
              {t("plans__dre__activate_btn")}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
