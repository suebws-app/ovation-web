"use client";

import { useEffect, useState, startTransition, type ReactNode } from "react";
import { useTranslations, useLocale } from "next-intl";
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
import { formatMoney } from "@/lib/utils/currency";

type Translator = (
  key: string,
  values?: Record<string, string | number>,
) => string;

const formatPrice = (plan: Plan, locale: string, t: Translator) => {
  if (plan.priceCents === 0) return t("plans__price_free");
  return (
    plan.productVariables?.regularPriceFormatted ??
    formatMoney(plan.priceCents, plan.currency, locale)
  );
};

const formatPer = (cents: number, isPro: boolean, t: Translator) => {
  if (cents === 0) return t("plans__per_free");
  return isPro ? t("plans__per_monthly") : t("plans__per_onetime");
};

const buildFeatures = (plan: Plan, locale: string, t: Translator): string[] => {
  const features: string[] = [];
  features.push(
    plan.messageLimit === null
      ? t("plans__feature_unlimited_messages")
      : t("plans__feature_message_limit", { count: plan.messageLimit }),
  );
  if (plan.storageDays === null)
    features.push(t("plans__feature_lifetime_storage"));
  else
    features.push(t("plans__feature_storage_days", { days: plan.storageDays }));
  if (plan.creditCents > 0) {
    features.push(
      t("plans__feature_keepsake_credit", {
        amount: formatMoney(plan.creditCents, plan.currency, locale),
      }),
    );
  }
  features.push(t("plans__feature_auto_transcription"));
  return features;
};

import { getOrigin } from "@/lib/utils/browser";

type PlansPickerProps = {
  mode: "couple" | "pro";
  plans: Plan[];
  currencySelect?: ReactNode;
};

export const PlansPicker = (props: PlansPickerProps) => {
  const t = useTranslations();
  const locale = useLocale();
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
              orderType: "plan",
              planTier: planCode as CheckoutPlanTier,
              successUrl,
              cancelUrl,
            });
      router.push(checkout.checkoutUrl);
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
  const resolvedCurrency = sorted[0]?.price?.currency?.toUpperCase();
  const showFxNote = !!resolvedCurrency && resolvedCurrency !== "EUR";

  return (
    <div className="bg-background min-h-[calc(100vh-89px)]">
      <div className="mx-auto max-w-310 px-6 py-14">
        <div className="mb-10 text-center">
          <Kicker className="text-primary">
            {t("activate_link__eyebrow")}
          </Kicker>
          <h1 className="type-h0 mt-3.5 leading-tight font-semibold tracking-tight">
            {t("activate_link__title_a")}{" "}
            <span className="text-primary italic">
              {t("activate_link__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-muted-foreground mx-auto mt-3.5 max-w-140 leading-relaxed">
            {t("activate_link__subtitle")}
          </p>
          {props.currencySelect && (
            <div className="mt-5 flex justify-center">
              {props.currencySelect}
            </div>
          )}
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
              price={formatPrice(plan, locale, t)}
              per={formatPer(plan.priceCents, isPro, t)}
              description={plan.description ?? ""}
              features={buildFeatures(plan, locale, t)}
              priceNote={
                showFxNote && plan.priceCents > 0
                  ? t("activate_link__price_approximate_note")
                  : undefined
              }
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
