"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { eventsClient } from "@/lib/api/events-client";
import { paymentsClient } from "@/lib/api/payments-client";
import { profileClient } from "@/lib/api/profile-client";
import { ApiError } from "@/lib/api/client";
import { invalidateCsrfToken } from "@/lib/api/csrf-token";
import { clientEnv as env } from "@/lib/utils/env.client";
import { getOrigin } from "@/lib/utils/browser";
import { appRoutes } from "@/lib/routes";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import type {
  CheckoutPlanTier,
  ProCheckoutSessionInput,
} from "@/lib/api/types";

export type CheckoutState =
  | { kind: "creating" }
  | { kind: "redirecting" }
  | { kind: "error"; message: string };

const PLAN_TIER_BY_ID: Record<string, CheckoutPlanTier> = {
  keepsake: "premium",
  gold: "bundle",
};

const toIsoDate = (date: Date | null): string | undefined => {
  if (!date || Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

type UseCheckoutFlowReturn = {
  state: CheckoutState;
  retry: () => void;
};

const isUnauthorizedError = (error: unknown): boolean =>
  ApiError.isApiError(error) && error.status === 401;

export const useCheckoutFlow = (): UseCheckoutFlowReturn => {
  const t = useTranslations();
  const router = useRouter();
  const signUpFormData = useSignUpStore((s) => s.formData);
  const eventFormData = useCreateEventStore((s) => s.formData);
  const updateEventData = useCreateEventStore((s) => s.updateFormData);
  const [state, setState] = useState<CheckoutState>({ kind: "creating" });
  const [retryToken, setRetryToken] = useState(0);

  const inflightRef = useRef<Map<number, Promise<CheckoutState>>>(new Map());

  const stashPendingEventData = useCallback(() => {
    if (typeof window === "undefined") return;
    const eventData = useCreateEventStore.getState().formData;
    const partnerA =
      eventData.partner1Name?.trim() || t("signup__partner_a_default");
    const partnerB =
      eventData.partner2Name?.trim() || t("signup__partner_b_default");
    window.sessionStorage?.setItem(
      "ovation_pending_event_data",
      JSON.stringify({
        partnerAName: partnerA,
        partnerBName: partnerB,
        weddingDate: toIsoDate(eventData.weddingDate) ?? null,
        venueName: eventData.venueName?.trim() || null,
        venueCity: eventData.venueCity?.trim() || null,
        desiredSlug: eventData.bookUrl.trim() || null,
      }),
    );
  }, [t]);

  useEffect(() => {
    const token = retryToken;
    let mounted = true;

    const safeSet = (next: CheckoutState) => {
      if (mounted) setState(next);
    };

    const run = async () => {
      const inflight = inflightRef.current;
      const existing = inflight.get(token);
      if (existing) {
        safeSet(await existing);
        return;
      }

      const work = (async (): Promise<CheckoutState> => {
        invalidateCsrfToken();
        const successUrl = `${getOrigin(env.APP_URL)}${appRoutes.checkout.success}`;
        const cancelUrl = `${getOrigin(env.APP_URL)}${appRoutes.auth.plans}`;
        const isPro = signUpFormData.accountType === "pro";

        if (isPro) {
          if (!signUpFormData.selectedPlan) {
            router.push(appRoutes.auth.plans);
            return { kind: "redirecting" };
          }
          safeSet({ kind: "redirecting" });
          try {
            stashPendingEventData();
            const checkout = await paymentsClient.createProCheckoutSession({
              planCode:
                signUpFormData.selectedPlan as ProCheckoutSessionInput["planCode"],
              successUrl,
              cancelUrl,
            });
            window.location.assign(checkout.checkoutUrl);
            return { kind: "redirecting" };
          } catch (error) {
            if (isUnauthorizedError(error)) {
              router.push(appRoutes.auth.verify);
              return { kind: "redirecting" };
            }
            return {
              kind: "error",
              message: ApiError.isApiError(error)
                ? error.message
                : t("signup__completion__error_checkout_default"),
            };
          }
        }

        const partnerATrim = eventFormData.partner1Name?.trim() ?? "";
        const partnerBTrim = eventFormData.partner2Name?.trim() ?? "";

        if (!partnerATrim && !partnerBTrim) {
          router.push(appRoutes.app.root);
          return { kind: "redirecting" };
        }

        const partnerA = partnerATrim || t("signup__partner_a_default");
        const partnerB = partnerBTrim || t("signup__partner_b_default");
        const bookUrl = useCreateEventStore.getState().formData.bookUrl;

        try {
          const existingEventId =
            typeof window !== "undefined"
              ? (window.sessionStorage?.getItem("ovation_signup_event_id") ??
                null)
              : null;

          const event = existingEventId
            ? await eventsClient
                .update(existingEventId, {
                  partnerAName: partnerA,
                  partnerBName: partnerB,
                  weddingDate: toIsoDate(eventFormData.weddingDate),
                  venueName: eventFormData.venueName?.trim() || undefined,
                  venueCity: eventFormData.venueCity?.trim() || undefined,
                })
                .then((r) => r.event)
                .catch(async () => {
                  const created = await eventsClient.create({
                    partnerAName: partnerA,
                    partnerBName: partnerB,
                    weddingDate: toIsoDate(eventFormData.weddingDate),
                    venueName: eventFormData.venueName?.trim() || undefined,
                    venueCity: eventFormData.venueCity?.trim() || undefined,
                  });
                  return created.event;
                })
            : await eventsClient
                .create({
                  partnerAName: partnerA,
                  partnerBName: partnerB,
                  weddingDate: toIsoDate(eventFormData.weddingDate),
                  venueName: eventFormData.venueName?.trim() || undefined,
                  venueCity: eventFormData.venueCity?.trim() || undefined,
                })
                .then((r) => r.event);

          const desiredSlug = bookUrl.trim();
          let finalSlug = event.slug;
          if (
            desiredSlug &&
            desiredSlug !== finalSlug &&
            /^[a-z0-9-]{4,20}$/.test(desiredSlug)
          ) {
            try {
              const updated = await eventsClient.update(event.id, {
                slug: desiredSlug,
              });
              finalSlug = updated.event.slug;
            } catch {
              finalSlug = event.slug;
            }
          }
          updateEventData({ bookUrl: finalSlug });

          await profileClient.markOnboardingComplete().catch(() => undefined);

          const planTier = PLAN_TIER_BY_ID[signUpFormData.selectedPlan ?? ""];
          if (!planTier) {
            safeSet({ kind: "redirecting" });
            router.push(appRoutes.app.root);
            return { kind: "redirecting" };
          }

          safeSet({ kind: "redirecting" });
          try {
            const checkout = await paymentsClient.createCheckoutSession({
              eventId: event.id,
              orderType: "plan",
              planTier,
              successUrl,
              cancelUrl,
            });
            if (!checkout.checkoutUrl) {
              throw new Error("Checkout session missing redirect URL");
            }
            window.location.assign(checkout.checkoutUrl);
            return { kind: "redirecting" };
          } catch (error) {
            if (isUnauthorizedError(error)) {
              router.push(appRoutes.auth.verify);
              return { kind: "redirecting" };
            }
            return {
              kind: "error",
              message: ApiError.isApiError(error)
                ? error.message
                : t("signup__completion__error_checkout_default"),
            };
          }
        } catch (error) {
          if (isUnauthorizedError(error)) {
            router.push(appRoutes.auth.verify);
            return { kind: "redirecting" };
          }
          return {
            kind: "error",
            message: ApiError.isApiError(error)
              ? error.message
              : t("signup__completion__error_create_default"),
          };
        }
      })();

      inflight.set(token, work);
      safeSet(await work);
    };

    run();
    return () => {
      mounted = false;
    };
  }, [
    retryToken,
    eventFormData.partner1Name,
    eventFormData.partner2Name,
    eventFormData.weddingDate,
    eventFormData.venueName,
    eventFormData.venueCity,
    signUpFormData.selectedPlan,
    signUpFormData.accountType,
    stashPendingEventData,
    updateEventData,
    router,
    t,
  ]);

  return {
    state,
    retry: () => {
      setState({ kind: "creating" });
      setRetryToken((n) => n + 1);
    },
  };
};
