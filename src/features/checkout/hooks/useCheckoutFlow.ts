"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { eventsClient } from "@/lib/api/events-client";
import { paymentsClient } from "@/lib/api/payments-client";
import { ApiError } from "@/lib/api/client";
import { invalidateCsrfToken } from "@/lib/api/csrf-token";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import { env } from "@/lib/utils/env";
import { appRoutes } from "@/lib/routes";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import type {
  CheckoutPlanTier,
  CoverPhotoContentType,
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

const ALLOWED_COVER_MIMES: Record<string, CoverPhotoContentType> = {
  "image/jpeg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  "image/heic": "image/heic",
};

const toIsoDate = (date: Date | null): string | undefined => {
  if (!date || Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

const getOrigin = () =>
  typeof window !== "undefined" ? window.location.origin : env.APP_URL;

const uploadCoverPhoto = async (
  eventId: string,
  file: File,
): Promise<string | null> => {
  const contentType = ALLOWED_COVER_MIMES[file.type];
  if (!contentType) return null;
  const { uploadUrl, key, publicUrl } = await eventsClient.coverUploadUrl(
    eventId,
    contentType,
  );
  await uploadToTarget({ url: uploadUrl, key }, file);
  return publicUrl;
};

type UseCheckoutFlowReturn = {
  state: CheckoutState;
  retry: () => void;
};

export const useCheckoutFlow = (): UseCheckoutFlowReturn => {
  const t = useTranslations();
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
        venueName: eventData.venue?.trim() || null,
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
        const successUrl = `${getOrigin()}${appRoutes.checkout.success}`;
        const cancelUrl = `${getOrigin()}${appRoutes.auth.plans}`;
        const isPro = signUpFormData.accountType === "pro";

        if (isPro) {
          if (!signUpFormData.selectedPlan) {
            window.location.assign(appRoutes.auth.plans);
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
          window.location.assign(appRoutes.app.root);
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
                  venueName: eventFormData.venue?.trim() || undefined,
                })
                .then((r) => r.event)
                .catch(async () => {
                  const created = await eventsClient.create({
                    partnerAName: partnerA,
                    partnerBName: partnerB,
                    weddingDate: toIsoDate(eventFormData.weddingDate),
                    venueName: eventFormData.venue?.trim() || undefined,
                  });
                  return created.event;
                })
            : await eventsClient
                .create({
                  partnerAName: partnerA,
                  partnerBName: partnerB,
                  weddingDate: toIsoDate(eventFormData.weddingDate),
                  venueName: eventFormData.venue?.trim() || undefined,
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

          if (eventFormData.coverFile) {
            try {
              const publicUrl = await uploadCoverPhoto(
                event.id,
                eventFormData.coverFile,
              );
              if (publicUrl) {
                await eventsClient
                  .update(event.id, { couplePhotoUrl: publicUrl })
                  .catch(() => undefined);
              }
            } catch {
              // non-fatal
            }
          }

          const planTier =
            PLAN_TIER_BY_ID[signUpFormData.selectedPlan ?? ""];
          if (!planTier) {
            safeSet({ kind: "redirecting" });
            window.location.assign(appRoutes.app.root);
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
            window.location.assign(checkout.checkoutUrl);
            return { kind: "redirecting" };
          } catch (error) {
            return {
              kind: "error",
              message: ApiError.isApiError(error)
                ? error.message
                : t("signup__completion__error_checkout_default"),
            };
          }
        } catch (error) {
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
    eventFormData.venue,
    eventFormData.coverFile,
    signUpFormData.selectedPlan,
    signUpFormData.accountType,
    stashPendingEventData,
    updateEventData,
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
