"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";

import { InfoIcon } from "@ovation/icons/InfoIcon";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useSession } from "@/lib/auth/client";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useHydrateStore } from "@/lib/storage/useHydrateStore";
import { useSlugChecker } from "@/features/create/hooks/useSlugChecker";
import { useSlugSuggestions } from "@/features/create/hooks/useSlugSuggestions";
import { COVER_OPTIONS } from "@/features/create/constants";
import { eventsClient } from "@/lib/api/events-client";
import { profileClient } from "@/lib/api/profile-client";
import { ApiError } from "@/lib/api/client";
import { setCookie } from "@/lib/utils/cookies";
import { BookPreview } from "./components/BookPreview";
import { CoverPattern } from "./components/CoverPattern";
import { CoverPhotoSelector } from "./components/CoverPhotoSelector";
import { SlugInput } from "./components/SlugInput";

const LAST_EVENT_COOKIE = "ovation_last_event_id";
const LAST_EVENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const toIsoDate = (date: Date | null): string | undefined => {
  if (!date) return undefined;
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
};

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
        as === "couple" || as === "pro"
          ? `${appRoutes.create.root}?as=${as}`
          : appRoutes.create.root;
      router.replace(target);
    }
  }, [router, hydrated, searchParams]);

  const slug = formData.bookUrl || "";
  const status = useSlugChecker(slug);
  const { suggestions, isLoading: suggestionsLoading } = useSlugSuggestions(
    formData.partner1Name,
    formData.partner2Name,
  );

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverFilePreview, setCoverFilePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (coverFilePreview) URL.revokeObjectURL(coverFilePreview);
    };
  }, [coverFilePreview]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canContinue =
    status !== "invalid" && status !== "taken" && !isSubmitting;

  const handleSelectPreset = (id: string) => {
    if (coverFilePreview) URL.revokeObjectURL(coverFilePreview);
    setCoverFile(null);
    setCoverFilePreview(null);
    updateFormData({ coverType: id });
  };

  const handleSelectFile = (file: File) => {
    if (coverFilePreview) URL.revokeObjectURL(coverFilePreview);
    const preview = URL.createObjectURL(file);
    setCoverFile(file);
    setCoverFilePreview(preview);
    updateFormData({ coverType: "" });
  };

  const handleContinue = async () => {
    if (!session?.user) {
      const asFromUrl = searchParams.get("as");
      const type =
        asFromUrl === "pro" || asFromUrl === "couple"
          ? asFromUrl
          : accountType || "couple";
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
      const partnerAName =
        data.partner1Name.trim() || t("signup__partner_a_default");
      const partnerBName =
        data.partner2Name.trim() || t("signup__partner_b_default");
      const weddingDate = toIsoDate(data.weddingDate);
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
        });
        targetEventId = event.id;
      } else {
        const created = await eventsClient.create({
          partnerAName,
          partnerBName,
          weddingDate,
          venueName,
          venueCity,
        });
        targetEventId = created.event.id;
      }

      await profileClient.markOnboardingComplete().catch(() => undefined);

      const desiredSlug = data.bookUrl?.trim();
      if (desiredSlug && /^[a-z0-9-]{4,20}$/.test(desiredSlug)) {
        try {
          await eventsClient.update(targetEventId, { slug: desiredSlug });
        } catch {
          // Slug clash — keep existing
        }
      }

      setCookie(LAST_EVENT_COOKIE, targetEventId, {
        maxAge: LAST_EVENT_COOKIE_MAX_AGE,
      });
      reset();
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

  const initials = `${formData.partner1Name?.[0] ?? "L"}&${formData.partner2Name?.[0] ?? "T"}`;
  const generatedSlug = useMemo(
    () =>
      `${formData.partner1Name?.toLowerCase() || "partner1"}-and-${formData.partner2Name?.toLowerCase() || "partner2"}`
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 20),
    [formData.partner1Name, formData.partner2Name],
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

  if (!hydrated) return null;

  return (
    <AuthSplitLayout
      panel={
        <>
          <Kicker className="relative tracking-[2.5px] opacity-80">
            {t("signup__cover__brand_eyebrow")}
          </Kicker>
          <BookPreview
            partner1={formData.partner1Name}
            partner2={formData.partner2Name}
            date={formData.weddingDate?.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            venue={[formData.venueName, formData.venueCity]
              .filter(Boolean)
              .join(", ")}
            coverImage={
              coverFilePreview ? (
                <img
                  src={coverFilePreview}
                  alt={t("signup__cover__step_label")}
                  className="size-full object-cover"
                />
              ) : formData.coverType && formData.coverType !== "upload" ? (
                <CoverPattern
                  tint={
                    COVER_OPTIONS.find((o) => o.id === formData.coverType)
                      ?.tint ?? "#EFC9A8"
                  }
                />
              ) : undefined
            }
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

        <CoverPhotoSelector
          coverType={formData.coverType}
          coverFile={coverFile}
          coverFilePreview={coverFilePreview}
          initials={initials}
          onSelectPreset={handleSelectPreset}
          onSelectFile={handleSelectFile}
        />

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

        <div className="rounded-12 bg-primary/10 tablet:mt-5 tablet:p-3 tablet:gap-2.5 mt-2 flex items-start gap-2 p-2.5">
          <InfoIcon
            width={14}
            height={14}
            className="text-primary mt-0.5 shrink-0"
            strokeWidth={1.8}
          />
          <p className="type-caption text-muted-foreground leading-snug">
            {t.rich("signup__claim__notice", {
              strong: (chunks) => (
                <strong className="text-foreground">{chunks}</strong>
              ),
              mono: (chunks) => <span className="font-mono">{chunks}</span>,
            })}
          </p>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          size="lg"
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
