"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@ovation/ui/components/Button";
import { subscriptionsClient } from "@/lib/api/subscriptions-client";
import { ApiError } from "@/lib/api/client";
import { appRoutes } from "@/lib/routes";
import type { Plan } from "@/lib/api/types";

type DreUpgradeCardProps = {
  plan: Plan;
};

export const DreUpgradeCard = ({ plan }: DreUpgradeCardProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleActivate = () => {
    setError(null);
    startTransition(async () => {
      try {
        await subscriptionsClient.dreIntent();
        router.push(appRoutes.settings.billing);
      } catch (err) {
        if (ApiError.isApiError(err) && err.status === 409) {
          router.push(appRoutes.settings.billing);
          return;
        }
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
