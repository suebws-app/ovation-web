"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { eventsClient } from "@/lib/api/events-client";
import { paymentsClient } from "@/lib/api/payments-client";
import { ApiError } from "@/lib/api/client";
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
import { CompletionCheckoutState } from "../components/CompletionCheckoutState";
import { CompletionSuccessView } from "../components/CompletionSuccessView";

type CreationState =
  | { kind: "creating" }
  | { kind: "redirecting" }
  | { kind: "checkout"; transactionId: string; orderId: string; successUrl: string; email: string }
  | { kind: "ready"; slug: string }
  | { kind: "error"; message: string };

const PLAN_TIER_BY_ID: Record<string, CheckoutPlanTier | null> = {
  essential: null,
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

const extractTransactionId = (checkoutUrl: string): string | null => {
  try {
    return new URL(checkoutUrl).searchParams.get("_ptxn");
  } catch {
    return null;
  }
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

export const CompletionStep = () => {
  const t = useTranslations();
  const formData = useSignUpStore((s) => s.formData);
  const updateFormData = useSignUpStore((s) => s.updateFormData);
  const [state, setState] = useState<CreationState>({ kind: "creating" });
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { email, bookUrl } = useSignUpStore.getState().formData;
      const partnerA = formData.partner1Name?.trim() || t("signup__partner_a_default");
      const partnerB = formData.partner2Name?.trim() || t("signup__partner_b_default");
      const successUrl = `${getOrigin()}${appRoutes.auth.signUpDone}`;
      const cancelUrl = `${getOrigin()}${appRoutes.auth.signUpPlan}`;

      try {
        const { event } = await eventsClient.create({
          partnerAName: partnerA,
          partnerBName: partnerB,
          weddingDate: toIsoDate(formData.weddingDate),
          venueName: formData.venue?.trim() || undefined,
        });
        if (cancelled) return;

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

        if (cancelled) return;
        updateFormData({ bookUrl: finalSlug });

        if (formData.coverFile) {
          try {
            const publicUrl = await uploadCoverPhoto(event.id, formData.coverFile);
            if (publicUrl) {
              await eventsClient.update(event.id, { couplePhotoUrl: publicUrl }).catch(() => undefined);
            }
          } catch {
            // intentional fall-through: cover upload is non-fatal
          }
          if (cancelled) return;
        }

        const isPro = formData.accountType === "pro";

        if (isPro && formData.selectedPlan) {
          setState({ kind: "redirecting" });
          try {
            const checkout = await paymentsClient.createProCheckoutSession({
              planCode: formData.selectedPlan as ProCheckoutSessionInput["planCode"],
              eventId: event.id,
              successUrl,
              cancelUrl,
            });
            if (cancelled) return;
            const txnId = extractTransactionId(checkout.checkoutUrl);
            if (txnId) {
              setState({ kind: "checkout", transactionId: txnId, orderId: checkout.orderId, successUrl, email });
            } else {
              window.location.assign(checkout.checkoutUrl);
            }
          } catch (error) {
            if (!cancelled) {
              setState({
                kind: "error",
                message: ApiError.isApiError(error) ? error.message : t("signup__completion__error_checkout_default"),
              });
            }
          }
          return;
        }

        if (isPro) {
          window.location.assign(appRoutes.app.eventMessages(event.id));
          return;
        }

        const planTier = PLAN_TIER_BY_ID[formData.selectedPlan ?? ""] ?? null;
        if (planTier) {
          setState({ kind: "redirecting" });
          try {
            const checkout = await paymentsClient.createCheckoutSession({
              eventId: event.id,
              orderType: "plan",
              planTier,
              successUrl,
              cancelUrl,
            });
            if (cancelled) return;
            const txnId = extractTransactionId(checkout.checkoutUrl);
            if (txnId) {
              setState({ kind: "checkout", transactionId: txnId, orderId: checkout.orderId, successUrl, email });
            } else {
              window.location.assign(checkout.checkoutUrl);
            }
          } catch (error) {
            if (!cancelled) {
              setState({
                kind: "error",
                message: ApiError.isApiError(error) ? error.message : t("signup__completion__error_checkout_default"),
              });
            }
          }
          return;
        }

        setState({ kind: "ready", slug: finalSlug });
      } catch (error) {
        if (cancelled) return;
        setState({
          kind: "error",
          message: ApiError.isApiError(error) ? error.message : t("signup__completion__error_create_default"),
        });
      }
    };

    run();
    return () => {
      cancelled = true;
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
    updateFormData,
    t,
  ]);

  if (state.kind === "creating") return <CompletionCreatingState />;
  if (state.kind === "redirecting") return <CompletionRedirectingState />;
  if (state.kind === "checkout") {
    return (
      <CompletionCheckoutState
        transactionId={state.transactionId}
        orderId={state.orderId}
        successUrl={state.successUrl}
        email={state.email}
      />
    );
  }
  if (state.kind === "error") {
    return (
      <CompletionErrorState
        message={state.message}
        onRetry={() => {
          setState({ kind: "creating" });
          setRetryToken((n) => n + 1);
        }}
      />
    );
  }

  return <CompletionSuccessView slug={state.slug} />;
};
