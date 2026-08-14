"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";

import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useSession } from "@/lib/auth/client";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useHydrateStore } from "@/lib/storage/useHydrateStore";
import { startNavigation } from "@/components/NavigationProgress";
import { useSlugChecker } from "@/features/create/hooks/useSlugChecker";
import { useSlugSuggestions } from "@/features/create/hooks/useSlugSuggestions";
import { CoverPageSkeleton } from "@/features/create/skeletons/CoverPageSkeleton";
import { eventsClient } from "@/lib/api/events-client";
import { profileClient } from "@/lib/api/profile-client";
import { ApiError } from "@/lib/api/client";
import type { UpdateEventInput } from "@/lib/api/types";
import { setCookie } from "@/lib/utils/cookies";
import { isConsumerRole, isProRole } from "@/lib/auth/account-role";
import { toIsoDate } from "@/lib/utils/formatDate";
import {
  clearPendingEvent,
  stashPendingEvent,
} from "@/features/create/pendingEvent";
import { getEventTypeConfig } from "@/lib/event-types";
import { formatPreviewDate } from "@/features/create/formatPreviewDate";
import {
  resolveEventThemePreset,
  scaleFor,
} from "@/lib/theme/eventThemePresets";
import { BookPreview } from "./components/BookPreview";
import { CoverPattern } from "./components/CoverPattern";
import { CoverColorSelector } from "./components/CoverColorSelector";
import { SlugInput } from "./components/SlugInput";

const LAST_EVENT_COOKIE = "ovation_last_event_id";
const LAST_EVENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const CoverPage = () => {
  const t = useTranslations();
  const hydrated = useHydrateStore(useCreateEventStore);
  const { formData, updateFormData } = useCreateEventStore();
  const accountType = useSignUpStore((s) => s.formData.accountType);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!hydrated) return;
    const { partner1Name, partner2Name } =
      useCreateEventStore.getState().formData;
    if (!partner1Name.trim() && !partner2Name.trim()) {
      const as = searchParams.get("as");
      const target =
        isConsumerRole(as) || isProRole(as)
          ? `${appRoutes.create.details}?as=${as}`
          : appRoutes.create.details;
      router.replace(target);
    }
  }, [router, hydrated, searchParams]);

  const slug = formData.bookUrl || "";
  const status = useSlugChecker(slug);
  const { suggestions, isLoading: suggestionsLoading } = useSlugSuggestions(
    formData.partner1Name,
    formData.partner2Name,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canContinue =
    status !== "invalid" && status !== "taken" && !isSubmitting;

  const handleContinue = async () => {
    if (!session?.user) {
      const asFromUrl = searchParams.get("as");
      const type =
        isProRole(asFromUrl) || isConsumerRole(asFromUrl)
          ? asFromUrl
          : accountType || "host";
      // Durably stash the wizard data so the event can be created after signup
      // even when email verification delays the session (see EnsureHostEvent).
      const data = useCreateEventStore.getState().formData;
      const hasSecondHost = getEventTypeConfig(data.eventType).fields.some(
        (f) => f.column === "hostBName",
      );
      stashPendingEvent({
        eventType: data.eventType,
        partnerAName:
          data.partner1Name.trim() || t("signup__partner_a_default"),
        // Single-host types (corporate, memorial, …) have no second host —
        // don't invent a bogus "Partner 2".
        partnerBName: hasSecondHost
          ? data.partner2Name.trim() || t("signup__partner_b_default")
          : undefined,
        weddingDate:
          data.weddingDate && !Number.isNaN(data.weddingDate.getTime())
            ? toIsoDate(data.weddingDate)
            : undefined,
        endDate:
          data.endDate && !Number.isNaN(data.endDate.getTime())
            ? toIsoDate(data.endDate)
            : undefined,
        venueName: data.venueName?.trim() || undefined,
        venueCity: data.venueCity?.trim() || undefined,
        themeColor: data.themeColor || undefined,
        details: data.details,
        desiredSlug: data.bookUrl?.trim() || undefined,
      });
      startNavigation();
      router.push(`${appRoutes.auth.signUp}?as=${type}`);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const {
      formData: data,
      mode,
      eventId,
      reset,
    } = useCreateEventStore.getState();

    try {
      const hasSecondHost = getEventTypeConfig(data.eventType).fields.some(
        (f) => f.column === "hostBName",
      );
      const partnerAName =
        data.partner1Name.trim() || t("signup__partner_a_default");
      const partnerBName = hasSecondHost
        ? data.partner2Name.trim() || t("signup__partner_b_default")
        : undefined;
      const weddingDate =
        data.weddingDate && !Number.isNaN(data.weddingDate.getTime())
          ? toIsoDate(data.weddingDate)
          : undefined;
      const venueName = data.venueName?.trim() || undefined;
      const venueCity = data.venueCity?.trim() || undefined;

      let targetEventId: string;
      if (mode === "edit" && eventId) {
        const { event } = await eventsClient.update(eventId, {
          partnerAName,
          partnerBName,
          weddingDate,
          venueName,
          venueCity,
          themeColor: data.themeColor || undefined,
        });
        targetEventId = event.id;
      } else {
        const created = await eventsClient.create({
          eventType: data.eventType,
          partnerAName,
          partnerBName,
          weddingDate,
          venueName,
          venueCity,
          details: data.details,
        });
        targetEventId = created.event.id;
      }

      await profileClient.markOnboardingComplete().catch(() => undefined);

      const updates: UpdateEventInput = {};
      const desiredSlug = data.bookUrl?.trim();
      if (desiredSlug && /^[a-z0-9-]{4,20}$/.test(desiredSlug)) {
        updates.slug = desiredSlug;
      }
      // `themeColor` is not accepted on create — apply it here (edit mode
      // already sent it in the update above).
      if (mode !== "edit" && data.themeColor) {
        updates.themeColor = data.themeColor;
      }
      if (Object.keys(updates).length > 0) {
        try {
          await eventsClient.update(targetEventId, updates);
        } catch {
          // Slug clash / non-fatal — keep existing
        }
      }

      setCookie(LAST_EVENT_COOKIE, targetEventId, {
        maxAge: LAST_EVENT_COOKIE_MAX_AGE,
      });
      clearPendingEvent();
      reset();
      startNavigation();
      router.push(appRoutes.app.root);
    } catch (error) {
      setSubmitError(
        ApiError.isApiError(error)
          ? error.message
          : t("signup__completion__error_create_default"),
      );
      setIsSubmitting(false);
    }
  };

  const hostNames = [formData.partner1Name, formData.partner2Name]
    .map((n) => n?.trim())
    .filter((n): n is string => Boolean(n));
  const titleLine = hostNames.join(" & ") || undefined;
  const initials = hostNames.map((n) => n[0]?.toUpperCase()).join("&") || "OV";
  const selectedPreset = resolveEventThemePreset({
    themeColor: formData.themeColor,
    eventType: formData.eventType,
  });
  const coverColor = scaleFor(
    selectedPreset.hue,
    selectedPreset.chromaMul,
    selectedPreset.deep,
  ).light.primary;
  const generatedSlug = useMemo(
    () =>
      (hostNames.length ? hostNames.join("-and-") : "my-event")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 20),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData.partner1Name, formData.partner2Name],
  );
  const formattedDate = formatPreviewDate(
    formData.weddingDate,
    formData.endDate,
    formData.eventType,
  );
  const [userEditedSlug, setUserEditedSlug] = useState(false);
  const lastAutoSlugRef = useRef<string | null>(null);

  useEffect(() => {
    const currentSlug = formData.bookUrl.trim();
    const shouldSyncGeneratedSlug =
      !userEditedSlug &&
      (currentSlug.length === 0 ||
        currentSlug === lastAutoSlugRef.current ||
        currentSlug === "partner1-and-partner");
    if (!shouldSyncGeneratedSlug || currentSlug === generatedSlug) return;
    lastAutoSlugRef.current = generatedSlug;
    updateFormData({ bookUrl: generatedSlug });
  }, [formData.bookUrl, generatedSlug, updateFormData, userEditedSlug]);

  const handleSlugChange = (value: string) => {
    setUserEditedSlug(true);
    updateFormData({ bookUrl: value });
  };

  const handleSuggestionClick = (value: string) => {
    setUserEditedSlug(true);
    updateFormData({ bookUrl: value });
  };

  const isInitialSuggestedSlug =
    !userEditedSlug && slug.trim() === generatedSlug;

  if (!hydrated) return <CoverPageSkeleton />;

  return (
    <AuthSplitLayout
      panel={
        <>
          <Kicker className="relative tracking-[2.5px] opacity-80">
            {t("signup__cover__brand_eyebrow")}
          </Kicker>
          <BookPreview
            title={titleLine}
            volumeLabel={t("signup__book_preview__volume")}
            titleFallback={t("signup__book_preview__title_fallback")}
            date={formattedDate}
            venue={[formData.venueName, formData.venueCity]
              .filter(Boolean)
              .join(", ")}
            coverImage={<CoverPattern tint={coverColor} />}
          />
          <p className="type-body-small relative max-w-90 leading-relaxed opacity-85">
            {t("signup__cover__brand_caption")}
          </p>
        </>
      }
    >
      <>
        <Kicker className="text-primary tablet:mb-3 mb-2">
          {t("auth__signup__eyebrow_step", {
            step: 2,
            label: t("signup__cover__step_label"),
          })}
        </Kicker>
        <h1 className="type-h2 tablet:type-h1 leading-tight font-semibold tracking-tight">
          {t("signup__cover__title_a")}{" "}
          <span className="text-primary italic">
            {t("signup__cover__title_b")}
          </span>
        </h1>
        <p className="type-body-small text-muted-foreground tablet:mt-2 mt-1.5 leading-relaxed">
          {t("signup__cover__subtitle")}
        </p>

        <div className="tablet:mt-6 mt-4">
          <CoverColorSelector
            value={formData.themeColor}
            onChange={(hex) => updateFormData({ themeColor: hex })}
            eventType={formData.eventType}
            initials={initials}
          />
        </div>

        <div className="tablet:mt-6 mt-4">
          <Kicker className="text-muted-foreground mb-2">
            {t("signup__claim__your_link")}
          </Kicker>
          <SlugInput
            value={slug}
            status={status}
            badgeKind={isInitialSuggestedSlug ? "suggested" : "available"}
            suggestions={suggestions}
            suggestionsLoading={suggestionsLoading}
            placeholder={t("signup__claim__placeholder")}
            onChange={handleSlugChange}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>

        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="shadow-primary/40 tablet:mt-5 mt-3 w-full rounded-full shadow-md"
        >
          {isSubmitting ? t("common__loading") : t("signup__claim__continue")}
        </Button>
        {submitError && (
          <p className="type-caption text-destructive mt-2 text-center">
            {submitError}
          </p>
        )}
      </>
    </AuthSplitLayout>
  );
};
