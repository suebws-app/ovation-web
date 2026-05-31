"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { InfoIcon } from "@ovation/icons/InfoIcon";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { useCreateEventStore } from "@/features/create/useCreateEventStore";
import { useSignUpStore } from "@/features/sign-up/useSignUpStore";
import { useSession } from "@/lib/auth/client";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useSlugChecker } from "@/features/create/hooks/useSlugChecker";
import { useSlugSuggestions } from "@/features/create/hooks/useSlugSuggestions";
import { COVER_OPTIONS } from "@/features/create/constants";
import { BookPreview } from "./components/BookPreview";
import { CoverPattern } from "./components/CoverPattern";
import { CoverPhotoSelector } from "./components/CoverPhotoSelector";
import { SlugInput } from "./components/SlugInput";

export const CoverPage = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useCreateEventStore();
  const accountType = useSignUpStore((s) => s.formData.accountType);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const { partner1Name, partner2Name } =
      useCreateEventStore.getState().formData;
    if (!partner1Name.trim() && !partner2Name.trim()) {
      router.replace(appRoutes.create.root);
    }
  }, [router]);

  const slug = formData.bookUrl || "";
  const status = useSlugChecker(slug);
  const { suggestions, isLoading: suggestionsLoading } = useSlugSuggestions(
    formData.partner1Name,
    formData.partner2Name,
  );

  useEffect(() => {
    return () => {
      if (formData.coverFilePreview) {
        URL.revokeObjectURL(formData.coverFilePreview);
      }
    };
  }, [formData.coverFilePreview]);

  const canContinue = slug.length === 0 || status === "available";

  const handleSelectPreset = (id: string) => {
    if (formData.coverFilePreview)
      URL.revokeObjectURL(formData.coverFilePreview);
    updateFormData({ coverType: id, coverFile: null, coverFilePreview: null });
  };

  const handleSelectFile = (file: File) => {
    if (formData.coverFilePreview)
      URL.revokeObjectURL(formData.coverFilePreview);
    const preview = URL.createObjectURL(file);
    updateFormData({
      coverType: "upload",
      coverFile: file,
      coverFilePreview: preview,
    });
  };

  const handleContinue = () => {
    if (session?.user) {
      router.push(appRoutes.create.done);
    } else {
      const type = accountType || "couple";
      router.push(`${appRoutes.auth.signUp}?as=${type}`);
    }
  };

  const initials = `${formData.partner1Name?.[0] ?? "L"}&${formData.partner2Name?.[0] ?? "T"}`;
  const placeholder = `${formData.partner1Name?.toLowerCase() || "partner1"}-and-${formData.partner2Name?.toLowerCase() || "partner2"}`;

  return (
    <AuthSplitLayout
      className="min-h-[calc(100vh-89px)]"
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
            venue={formData.venue}
            coverImage={
              formData.coverFilePreview ? (
                <img
                  src={formData.coverFilePreview}
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
        <Kicker className="text-primary mb-3">
          {t("auth__signup__eyebrow_step", {
            step: 2,
            label: t("signup__cover__step_label"),
          })}
        </Kicker>
        <h1 className="type-h1 leading-tight font-semibold tracking-tight">
          {t("signup__cover__title_a")}{" "}
          <span className="text-primary italic">
            {t("signup__cover__title_b")}
          </span>
        </h1>
        <p className="type-body-small text-muted-foreground mt-2 leading-relaxed">
          {t("signup__cover__subtitle")}
        </p>

        <CoverPhotoSelector
          coverType={formData.coverType}
          coverFile={formData.coverFile}
          coverFilePreview={formData.coverFilePreview}
          initials={initials}
          onSelectPreset={handleSelectPreset}
          onSelectFile={handleSelectFile}
        />

        <div className="mt-2">
          <Kicker className="text-muted-foreground mb-2">
            {t("signup__claim__your_link")}
          </Kicker>
          <SlugInput
            value={slug}
            status={status}
            suggestions={suggestions}
            suggestionsLoading={suggestionsLoading}
            placeholder={placeholder}
            onChange={(v) => updateFormData({ bookUrl: v })}
            onSuggestionClick={(v) => updateFormData({ bookUrl: v })}
          />
        </div>

        <div className="rounded-12 bg-primary/10 mt-5 flex items-start gap-2.5 p-3">
          <InfoIcon
            width={16}
            height={16}
            className="text-primary mt-0.5 shrink-0"
            strokeWidth={1.8}
          />
          <p className="type-caption text-muted-foreground leading-relaxed">
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
          className="shadow-primary/40 mt-5 w-full rounded-full shadow-md"
        >
          {t("signup__claim__continue")}
          <ArrowRightIcon width={16} height={16} />
        </Button>
      </>
    </AuthSplitLayout>
  );
};
