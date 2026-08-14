"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Button } from "@ovation/ui/components/Button";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { PlanOptionCard } from "@/features/plans/components/PlanOptionCard";
import { PRO_TIERS } from "@/features/marketing/PricingSection/constants";
import { usePlans } from "@/lib/query/plansQueries";
import { eventsClient } from "@/lib/api/events-client";
import { profileClient } from "@/lib/api/profile-client";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import { getEventTypeConfig } from "@/lib/event-types";
import { toIsoDate } from "@/lib/utils/formatDate";

const toEventDate = (date: Date | null): string | undefined =>
  date && !Number.isNaN(date.getTime()) ? toIsoDate(date) : undefined;

export const ProPlan = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useSignUpStore();
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(false);
  const { data } = usePlans();

  const priceFor = (planCode: string | null, fallback: string) => {
    const plan = data?.plans.find((p) => p.code === planCode);
    return plan?.productVariables.regularPriceFormatted ?? fallback;
  };

  const handleSelect = (key: string) => {
    updateFormData({ selectedPlan: key });
    setShowError(false);
  };

  const handleContinue = () => {
    if (!formData.selectedPlan) {
      setShowError(true);
      return;
    }
    router.push(appRoutes.checkout.root);
  };

  const handleStartFree = async () => {
    if (creating) return;
    setCreating(true);
    setCreateError(false);
    const eventData = useCreateEventStore.getState().formData;
    const hasSecondHost = getEventTypeConfig(eventData.eventType).fields.some(
      (f) => f.column === "hostBName",
    );
    const partnerA =
      eventData.partner1Name?.trim() || t("signup__partner_a_default");
    const partnerB = hasSecondHost
      ? eventData.partner2Name?.trim() || t("signup__partner_b_default")
      : undefined;
    try {
      const { event } = await eventsClient.create({
        eventType: eventData.eventType,
        partnerAName: partnerA,
        partnerBName: partnerB,
        weddingDate: toEventDate(eventData.weddingDate),
        endDate: toEventDate(eventData.endDate),
        venueName: eventData.venueName?.trim() || undefined,
        venueCity: eventData.venueCity?.trim() || undefined,
        details: eventData.details,
      });
      if (eventData.themeColor) {
        await eventsClient
          .update(event.id, { themeColor: eventData.themeColor })
          .catch(() => undefined);
      }
      await profileClient.markOnboardingComplete().catch(() => undefined);
      router.replace(appRoutes.app.root);
    } catch {
      setCreating(false);
      setCreateError(true);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-89px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        <Kicker className="text-primary mb-3">
          {t("signup__pro_plan__step_label")}
        </Kicker>
        <h1 className="type-h1 leading-tight font-semibold tracking-tight">
          {t("signup__pro_plan__title")}
          <br />
          <span className="text-primary italic">
            {t("signup__pro_plan__title_b")}
          </span>
        </h1>
        <p className="text-muted-foreground type-body-small mt-3 leading-relaxed">
          {t("signup__pro_plan__subtitle_v2")}
        </p>

        <div className="tablet:grid-cols-2 mt-10 grid grid-cols-1 gap-5">
          {PRO_TIERS.map(
            ({
              key,
              planCode,
              tagKey,
              nameKey,
              price,
              perKey,
              descKey,
              featKeys,
            }) => (
              <PlanOptionCard
                key={key}
                planKey={key}
                isSelected={formData.selectedPlan === key}
                tagLabel={t(tagKey)}
                name={t(nameKey)}
                price={priceFor(planCode, price)}
                per={t(perKey)}
                desc={t(descKey)}
                features={featKeys.map((k) => t(k))}
                onSelect={handleSelect}
              />
            ),
          )}
        </div>

        {showError && !formData.selectedPlan && (
          <p className="text-destructive type-body-small mt-6 text-center">
            {t("signup__pro_plan__select_required")}
          </p>
        )}

        <Button
          type="button"
          onClick={handleContinue}
          disabled={!formData.selectedPlan}
          className="shadow-primary/40 mt-8 w-full shadow-md"
        >
          {t("signup__pro_plan__continue")}
        </Button>

        {createError && (
          <p className="text-destructive type-body-small mt-6 text-center">
            {t("signup__pro_plan__free_error")}
          </p>
        )}

        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={handleStartFree}
            disabled={creating}
            className="text-muted-foreground hover:text-primary px-0 font-medium hover:bg-transparent"
          >
            {t("signup__pro_plan__start_free")}
          </Button>
        </div>
      </div>
    </div>
  );
};
