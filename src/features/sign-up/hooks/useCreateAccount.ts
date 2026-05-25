"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth/client";
import { invalidateCsrfToken } from "@/lib/api/csrf-token";
import { eventsClient } from "@/lib/api/events-client";
import { appRoutes } from "@/lib/routes";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import type { SignUpFields } from "@/features/sign-up/signUpSchema";

const toIsoDate = (date: Date | null): string | undefined => {
  if (!date || Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

type UseCreateAccountReturn = {
  onSubmit: (values: SignUpFields) => Promise<void>;
  submitError: string | null;
  turnstileToken: string | null;
  setTurnstileToken: (token: string | null) => void;
};

export const useCreateAccount = (): UseCreateAccountReturn => {
  const t = useTranslations();
  const router = useRouter();
  const updateFormData = useSignUpStore((s) => s.updateFormData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const onSubmit = async (values: SignUpFields) => {
    setSubmitError(null);

    const accountType =
      useSignUpStore.getState().formData.accountType || "couple";

    const signUpEmail = authClient.signUp.email as (opts: {
      email: string;
      password: string;
      name: string;
      accountType?: string;
    }) => Promise<{
      data?: { token?: string | null } | null;
      error?: { message?: string } | null;
    }>;

    const { error, data } = await signUpEmail({
      email: values.email,
      password: values.password,
      name: values.email.split("@")[0] ?? values.email,
      accountType,
    });

    const errorCode =
      ((error as Record<string, unknown>)?.code as string | undefined) ?? "";
    const isVerificationPending =
      !error ||
      (errorCode.toUpperCase().includes("EMAIL") &&
        errorCode.toUpperCase().includes("VERIF"));

    if (!isVerificationPending) {
      setSubmitError(
        error!.message ?? t("auth__signup__create_account__error_generic"),
      );
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage?.removeItem("ovation_signup_event_created");
      window.sessionStorage?.removeItem("ovation_signup_event_id");
      window.sessionStorage?.removeItem("ovation_pending_event_data");
    }

    invalidateCsrfToken();
    updateFormData({ email: values.email, agreedToTerms: true });

    if (!error && data?.token && accountType !== "pro") {
      try {
        const eventData = useCreateEventStore.getState().formData;
        const partnerA =
          eventData.partner1Name?.trim() || t("signup__partner_a_default");
        const partnerB =
          eventData.partner2Name?.trim() || t("signup__partner_b_default");
        const { event } = await eventsClient.create({
          partnerAName: partnerA,
          partnerBName: partnerB,
          weddingDate: toIsoDate(eventData.weddingDate),
          venueName: eventData.venue?.trim() || undefined,
        });
        if (typeof window !== "undefined") {
          window.sessionStorage?.setItem("ovation_signup_event_id", event.id);
          window.sessionStorage?.setItem("ovation_signup_event_created", "1");
        }
      } catch {
        // non-fatal: event will be created at checkout
      }
    }

    router.push(appRoutes.auth.plans);
  };

  return { onSubmit, submitError, turnstileToken, setTurnstileToken };
};
