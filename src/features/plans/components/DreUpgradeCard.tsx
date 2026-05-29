"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { paymentsClient } from "@/lib/api/payments-client";
import { appRoutes } from "@/lib/routes";
import type { Plan } from "@/lib/api/types";

type DreUpgradeCardProps = {
  plan: Plan;
};

const getOrigin = () =>
  typeof window !== "undefined" ? window.location.origin : "";

export const DreUpgradeCard = ({ plan }: DreUpgradeCardProps) => {
  const t = useTranslations();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleActivate = () => {
    setError(null);
    startTransition(async () => {
      try {
        const origin = getOrigin();
        const checkout = await paymentsClient.createDreCheckoutSession({
          successUrl: `${origin}${appRoutes.app.root}`,
          cancelUrl: `${origin}${appRoutes.app.root}`,
        });
        window.location.assign(checkout.checkoutUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "error");
      }
    });
  };

  return (
    <div className="rounded-16 border-border bg-card flex flex-col gap-4 border p-6">
      <h2 className="type-heading-small">{plan.name}</h2>
      <p className="type-body-small text-muted-foreground">
        {t("plans__dre__description")}
      </p>
      <p className="type-h3">
        €{(plan.priceCents / 100).toFixed(0)}
        <span className="type-body-small text-muted-foreground ml-1">
          {t("plans__dre__per_month")}
        </span>
      </p>
      {error && (
        <p className="type-body-small text-destructive">{error}</p>
      )}
      <Button
        type="button"
        variant="default"
        className="rounded-full"
        disabled={pending}
        onClick={handleActivate}
      >
        {t("plans__dre__activate_btn")}
      </Button>
    </div>
  );
};
