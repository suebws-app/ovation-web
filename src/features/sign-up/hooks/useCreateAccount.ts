import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { startNavigation } from "@/components/NavigationProgress";
import { authClient } from "@/lib/auth/client";
import { invalidateCsrfToken } from "@/lib/api/csrf-token";
import { eventsClient } from "@/lib/api/events-client";
import { profileClient } from "@/lib/api/profile-client";
import { appRoutes } from "@/lib/routes";
import { clientEnv as env } from "@/lib/utils/env.client";
import { getCookie } from "@/lib/utils/cookies";
import { toIsoDate } from "@/lib/utils/formatDate";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import {
  clearPendingEvent,
  stashPendingEvent,
} from "@/features/create/pendingEvent";
import { getEventTypeConfig } from "@/lib/event-types";
import type { SignUpFields } from "@/features/sign-up/signUpSchema";
import {
  CURRENCY_COOKIE,
  isSupportedCurrency,
  type Currency,
} from "@/i18n/currency-config";

const toWeddingDate = (date: Date | null): string | undefined =>
  date && !Number.isNaN(date.getTime()) ? toIsoDate(date) : undefined;

const readPreferredCurrencyCookie = (): Currency | undefined => {
  const raw = getCookie(CURRENCY_COOKIE);
  if (!raw) return undefined;
  return isSupportedCurrency(raw) ? raw : undefined;
};

type UseCreateAccountReturn = {
  onSubmit: (values: SignUpFields) => Promise<void>;
  submitError: string | null;
  turnstileToken: string | null;
  setTurnstileToken: (token: string | null) => void;
  turnstileResetKey: number;
};

export const useCreateAccount = (): UseCreateAccountReturn => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const updateFormData = useSignUpStore((s) => s.updateFormData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const onSubmit = async (values: SignUpFields) => {
    setSubmitError(null);

    const accountType =
      useSignUpStore.getState().formData.accountType || "host";

    if (env.TURNSTILE_SITE_KEY && !turnstileToken) {
      setSubmitError(t("auth__signup__error_turnstile"));
      return;
    }

    const signUpEmail = authClient.signUp.email as (
      opts: {
        email: string;
        password: string;
        name: string;
        accountType?: string;
        preferredLanguage?: string;
        preferredCurrency?: string;
      },
      fetchOptions?: { headers?: Record<string, string> },
    ) => Promise<{
      data?: { token?: string | null } | null;
      error?: { message?: string; code?: string } | null;
    }>;

    const preferredCurrency = readPreferredCurrencyCookie();

    const { error, data } = await signUpEmail(
      {
        email: values.email,
        password: values.password,
        name: values.email.split("@")[0] ?? values.email,
        accountType,
        preferredLanguage: locale,
        ...(preferredCurrency ? { preferredCurrency } : {}),
      },
      turnstileToken
        ? { headers: { "x-turnstile-token": turnstileToken } }
        : undefined,
    );

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
      setTurnstileToken(null);
      setTurnstileResetKey((k) => k + 1);
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage?.removeItem("ovation_signup_event_created");
      window.sessionStorage?.removeItem("ovation_signup_event_id");
      window.sessionStorage?.removeItem("ovation_pending_event_data");
    }

    invalidateCsrfToken();
    updateFormData({ email: values.email, agreedToTerms: true });

    if (accountType !== "pro") {
      const eventData = useCreateEventStore.getState().formData;
      const hasSecondHost = getEventTypeConfig(eventData.eventType).fields.some(
        (f) => f.column === "hostBName",
      );
      const trimmedA = eventData.partner1Name?.trim() ?? "";
      const trimmedB = eventData.partner2Name?.trim() ?? "";
      const partnerA = trimmedA || t("signup__partner_a_default");
      const partnerB = hasSecondHost
        ? trimmedB || t("signup__partner_b_default")
        : undefined;
      // Durably stash the event data so it survives an email-verification
      // round-trip (same browser) and the dashboard's EnsureHostEvent safety
      // net can create the event even when signup returns no session token.
      stashPendingEvent({
        eventType: eventData.eventType,
        partnerAName: partnerA,
        partnerBName: partnerB,
        weddingDate: toWeddingDate(eventData.weddingDate),
        endDate: toWeddingDate(eventData.endDate),
        venueName: eventData.venueName?.trim() || undefined,
        venueCity: eventData.venueCity?.trim() || undefined,
        themeColor: eventData.themeColor || undefined,
        details: eventData.details,
        desiredSlug: eventData.bookUrl?.trim() || undefined,
      });
    }

    if (!error && data?.token && accountType !== "pro") {
      try {
        const eventData = useCreateEventStore.getState().formData;
        const hasSecondHost = getEventTypeConfig(
          eventData.eventType,
        ).fields.some((f) => f.column === "hostBName");
        const trimmedA = eventData.partner1Name?.trim() ?? "";
        const trimmedB = eventData.partner2Name?.trim() ?? "";
        const partnerA = trimmedA || t("signup__partner_a_default");
        const partnerB = hasSecondHost
          ? trimmedB || t("signup__partner_b_default")
          : undefined;
        const { event } = await eventsClient.create({
          eventType: eventData.eventType,
          partnerAName: partnerA,
          partnerBName: partnerB,
          weddingDate: toWeddingDate(eventData.weddingDate),
          endDate: toWeddingDate(eventData.endDate),
          venueName: eventData.venueName?.trim() || undefined,
          venueCity: eventData.venueCity?.trim() || undefined,
          details: eventData.details,
        });
        // `themeColor` is not accepted on create — apply it after.
        if (eventData.themeColor) {
          await eventsClient
            .update(event.id, { themeColor: eventData.themeColor })
            .catch(() => undefined);
        }
        if (typeof window !== "undefined") {
          window.sessionStorage?.setItem("ovation_signup_event_id", event.id);
          window.sessionStorage?.setItem("ovation_signup_event_created", "1");
        }
        // The event was created, so onboarding is complete regardless of
        // whether a host name was typed (defaults are used when blank).
        // Otherwise the dashboard would keep showing the create-event CTA.
        await profileClient.markOnboardingComplete().catch(() => undefined);
        clearPendingEvent();
      } catch {
        // non-fatal: event will be created at checkout
      }
    }

    startNavigation();
    router.replace(data?.token ? appRoutes.auth.plans : appRoutes.auth.verify);
  };

  return {
    onSubmit,
    submitError,
    turnstileToken,
    setTurnstileToken,
    turnstileResetKey,
  };
};
