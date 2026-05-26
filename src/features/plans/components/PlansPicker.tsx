"use client";

import { useEffect, useState, startTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Kicker } from "@ovation/ui/components/Kicker";
import { PlanCard } from "@/features/plans/components/PlanCard";
import { CheckoutRedirecting as CompletionRedirectingState } from "@/features/checkout/components/CheckoutRedirecting";
import { paymentsClient } from "@/lib/api/payments-client";
import { ApiError } from "@/lib/api/client";
import { useRedirectOnBackNavigation } from "@/lib/hooks/useRedirectOnBackNavigation";
import { appRoutes } from "@/lib/routes";
import type {
  Plan,
  CheckoutPlanTier,
  ProCheckoutSessionInput,
} from "@/lib/api/types";
import { cn } from "@ovation/ui/utils/cn";

const formatPrice = (cents: number, currency: string) => {
  if (cents === 0) return "Free";
  const symbol = currency === "EUR" ? "€" : currency;
  return `${symbol}${(cents / 100).toFixed(0)}`;
};

const formatPer = (cents: number, isPro: boolean) => {
  if (cents === 0) return "free, forever";
  return isPro ? "per month" : "one-time";
};

const buildFeatures = (plan: Plan): string[] => {
  const features: string[] = [];
  features.push(
    plan.messageLimit === null
      ? "Unlimited messages"
      : `Up to ${plan.messageLimit} messages`,
  );
  if (plan.storageDays === null) features.push("Lifetime storage");
  else features.push(`${plan.storageDays} days storage`);
  if (plan.creditCents > 0) {
    features.push(`€${(plan.creditCents / 100).toFixed(0)} keepsake credit`);
  }
  features.push("Auto-transcription");
  return features;
};

const getOrigin = () =>
  typeof window !== "undefined" ? window.location.origin : "";

type PlansPickerProps =
  | { mode: "couple"; eventId: string; plans: Plan[] }
  | { mode: "pro"; plans: Plan[] };

export const PlansPicker = (props: PlansPickerProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startTransition(() => {
      setRedirecting(false);
      setError(null);
    });
    const handlePageShow = (event: PageTransitionEvent) => {
      setRedirecting(false);
      setError(null);
      if (event.persisted) router.refresh();
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [router]);

  useRedirectOnBackNavigation(appRoutes.app.root);

  const handleSelectPlan = async (planCode: string) => {
    setRedirecting(true);
    setError(null);
    const successUrl = `${getOrigin()}/checkout/{CHECKOUT_SESSION_ID}/success`;
    const cancelUrl = `${getOrigin()}/checkout/{CHECKOUT_SESSION_ID}/cancel`;
    try {
      const checkout =
        props.mode === "pro"
          ? await paymentsClient.createProCheckoutSession({
              planCode: planCode as ProCheckoutSessionInput["planCode"],
              successUrl,
              cancelUrl,
            })
          : await paymentsClient.createCheckoutSession({
              eventId: props.eventId,
              orderType: "plan",
              planTier: planCode as CheckoutPlanTier,
              successUrl,
              cancelUrl,
            });
      window.location.assign(checkout.checkoutUrl);
    } catch (err) {
      setRedirecting(false);
      setError(
        ApiError.isApiError(err)
          ? err.message
          : t("activate_link__error_default"),
      );
    }
  };

  if (redirecting) return <CompletionRedirectingState />;

  const sorted = [...props.plans].sort((a, b) => a.sortOrder - b.sortOrder);
  const highlightCode = sorted.find((p) => p.priceCents > 0)?.code;
  const isPro = props.mode === "pro";

  return (
    <div className="bg-background min-h-[calc(100vh-89px)]">
      <div className="mx-auto max-w-310 px-6 py-14">
        <div className="mb-10 text-center">
          <Kicker className="text-primary">
            {t("activate_link__eyebrow")}
          </Kicker>
          <h1 className="type-display mt-3.5 leading-tight font-semibold tracking-tight">
            {t("activate_link__title_a")}{" "}
            <span className="text-primary italic">
              {t("activate_link__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mx-auto mt-3.5 max-w-140 leading-relaxed">
            {t("activate_link__subtitle")}
          </p>
        </div>

        <div
          className={cn(
            "grid items-stretch gap-4.5",
            `tablet:grid-cols-${Math.min(sorted.length, 3)}`,
          )}
        >
          {sorted.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={formatPrice(plan.priceCents, plan.currency)}
              per={formatPer(plan.priceCents, isPro)}
              description={plan.description ?? ""}
              features={buildFeatures(plan)}
              highlighted={plan.code === highlightCode}
              onSelect={() => handleSelectPlan(plan.code)}
            />
          ))}
        </div>

        {error && (
          <p className="type-body-small text-destructive mt-6 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
