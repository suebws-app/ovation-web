"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { eventsClient } from "@/lib/api/events-client";
import { paymentsClient } from "@/lib/api/payments-client";
import { ApiError } from "@/lib/api/client";
import { invalidateCsrfToken } from "@/lib/api/csrf-token";
import { env } from "@/lib/utils/env";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import type {
  CheckoutPlanTier,
  CoverPhotoContentType,
  ProCheckoutSessionInput,
} from "@/lib/api/types";
import { appRoutes } from "@/lib/routes";
import { useSignUpStore } from "../useSignUpStore";
import { CompletionCreatingState } from "../components/CompletionCreatingState";
import { CompletionRedirectingState } from "../components/CompletionRedirectingState";
import { CompletionErrorState } from "../components/CompletionErrorState";

type CreationState =
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
  if (!date) return undefined;
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

const uploadCoverPhoto = async (eventId: string, file: File): Promise<string | null> => {
  const contentType = ALLOWED_COVER_MIMES[file.type];
  if (!contentType) return null;
  const { uploadUrl, key, publicUrl } = await eventsClient.coverUploadUrl(eventId, contentType);
  await uploadToTarget({ url: uploadUrl, key }, file);
  return publicUrl;
};

const getOrigin = () =>
  typeof window !== "undefined" ? window.location.origin : env.APP_URL;

const inflightRunsByToken = new Map<number, Promise<CreationState>>();

export const CompletionStep = () => {
  const t = useTranslations();
  const formData = useSignUpStore((s) => s.formData);
  const updateFormData = useSignUpStore((s) => s.updateFormData);
  const [state, setState] = useState<CreationState>({ kind: "creating" });
  const [retryToken, setRetryToken] = useState(0);

  const stashPendingEventData = useCallback(() => {
    if (typeof window === "undefined") return;
    const { bookUrl } = useSignUpStore.getState().formData;
    const partnerA = formData.partner1Name?.trim() || t("signup__partner_a_default");
    const partnerB = formData.partner2Name?.trim() || t("signup__partner_b_default");
    const payload = {
      partnerAName: partnerA,
      partnerBName: partnerB,
      weddingDate: toIsoDate(formData.weddingDate) ?? null,
      venueName: formData.venue?.trim() || null,
      desiredSlug: bookUrl.trim() || null,
    };
    window.sessionStorage?.setItem(
      "ovation_pending_event_data",
      JSON.stringify(payload),
    );
  }, [
    formData.partner1Name,
    formData.partner2Name,
    formData.weddingDate,
    formData.venue,
    t,
  ]);

  useEffect(() => {
    const token = retryToken;
    let mounted = true;

    const safeSetState = (next: CreationState) => {
      if (mounted) setState(next);
    };

    const run = async () => {
      const existing = inflightRunsByToken.get(token);
      if (existing) {
        const result = await existing;
        safeSetState(result);
        return;
      }

      const work = (async (): Promise<CreationState> => {
        invalidateCsrfToken();
        const partnerATrim = formData.partner1Name?.trim() ?? "";
        const partnerBTrim = formData.partner2Name?.trim() ?? "";
        const successUrl = `${getOrigin()}/checkout/{CHECKOUT_SESSION_ID}/success`;
        const cancelUrl = `${getOrigin()}/checkout/{CHECKOUT_SESSION_ID}/cancel`;
        const isPro = formData.accountType === "pro";

        if (isPro) {
          if (!formData.selectedPlan) {
            window.location.assign(appRoutes.auth.signUpPlan);
            return { kind: "redirecting" };
          }
          safeSetState({ kind: "redirecting" });
          try {
            stashPendingEventData();
            const checkout = await paymentsClient.createProCheckoutSession({
              planCode: formData.selectedPlan as ProCheckoutSessionInput["planCode"],
              successUrl,
              cancelUrl,
            });
            window.location.assign(checkout.checkoutUrl);
            return { kind: "redirecting" };
          } catch (error) {
            console.error("[signup] pro checkout failed", error);
            return {
              kind: "error",
              message: ApiError.isApiError(error) ? error.message : t("signup__completion__error_checkout_default"),
            };
          }
        }

        if (!partnerATrim && !partnerBTrim) {
          window.location.assign(appRoutes.app.root);
          return { kind: "redirecting" };
        }

        const partnerA = partnerATrim || t("signup__partner_a_default");
        const partnerB = partnerBTrim || t("signup__partner_b_default");
        const { bookUrl } = useSignUpStore.getState().formData;

        try {
          const { event } = await eventsClient.create({
            partnerAName: partnerA,
            partnerBName: partnerB,
            weddingDate: toIsoDate(formData.weddingDate),
            venueName: formData.venue?.trim() || undefined,
          });

          let finalSlug = event.slug;
          const desiredSlug = bookUrl.trim();
          if (desiredSlug && desiredSlug !== finalSlug && /^[a-z0-9-]{4,20}$/.test(desiredSlug)) {
            try {
              const updated = await eventsClient.update(event.id, { slug: desiredSlug });
              finalSlug = updated.event.slug;
            } catch {
              finalSlug = event.slug;
            }
          }
          updateFormData({ bookUrl: finalSlug });

          if (formData.coverFile) {
            try {
              const publicUrl = await uploadCoverPhoto(event.id, formData.coverFile);
              if (publicUrl) {
                await eventsClient.update(event.id, { couplePhotoUrl: publicUrl }).catch(() => undefined);
              }
            } catch {
              // non-fatal
            }
          }

          const planTier = PLAN_TIER_BY_ID[formData.selectedPlan ?? ""];
          if (!planTier) {
            safeSetState({ kind: "redirecting" });
            window.location.assign(appRoutes.app.root);
            return { kind: "redirecting" };
          }

          safeSetState({ kind: "redirecting" });
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
            console.error("[signup] couple checkout failed", error);
            return {
              kind: "error",
              message: ApiError.isApiError(error) ? error.message : t("signup__completion__error_checkout_default"),
            };
          }
        } catch (error) {
          console.error("[signup] event creation failed", error);
          return {
            kind: "error",
            message: ApiError.isApiError(error) ? error.message : t("signup__completion__error_create_default"),
          };
        }
      })();

      inflightRunsByToken.set(token, work);
      const result = await work;
      safeSetState(result);
    };

    run();
    return () => {
      mounted = false;
    };
  }, [
    retryToken,
    formData.partner1Name,
    formData.partner2Name,
    formData.weddingDate,
    formData.venue,
    formData.selectedPlan,
    formData.coverFile,
    formData.accountType,
    stashPendingEventData,
    updateFormData,
    t,
  ]);

  if (state.kind === "creating") return <CompletionCreatingState />;
  if (state.kind === "redirecting") return <CompletionRedirectingState />;
  return (
    <CompletionErrorState
      message={state.message}
      onRetry={() => {
        setState({ kind: "creating" });
        setRetryToken((n) => n + 1);
      }}
    />
  );
};
