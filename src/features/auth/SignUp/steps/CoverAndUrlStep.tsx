"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { InfoIcon } from "@ovation/icons/InfoIcon";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { BookPreview } from "@/features/auth/SignUp/components/BookPreview";
import { CoverOption } from "@/features/auth/SignUp/components/CoverOption";
import { CoverPattern } from "@/features/auth/SignUp/components/CoverPattern";
import { AvailableBadge } from "@/features/auth/SignUp/components/AvailableBadge";
import { UrlSuggestionChip } from "@/features/auth/SignUp/components/UrlSuggestionChip";
import {
  COVER_OPTIONS,
  ACCEPT_MIME,
  MAX_BYTES,
} from "@/features/events/CoverPhotoForm";
import { useSignUpStore } from "../useSignUpStore";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { eventsClient } from "@/lib/api/events-client";

type SlugStatus = "idle" | "invalid" | "checking" | "available" | "taken";

const SLUG_PATTERN = /^[a-z0-9-]{4,20}$/;

export const CoverAndUrlStep = () => {
  const t = useTranslations();
  const { formData, updateFormData } = useSignUpStore();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<SlugStatus>("idle");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const slug = formData.bookUrl || "";

  useEffect(() => {
    return () => {
      if (formData.coverFilePreview) {
        URL.revokeObjectURL(formData.coverFilePreview);
      }
    };
  }, [formData.coverFilePreview]);

  useEffect(() => {
    if (slug.length === 0) {
      setStatus("idle");
      return;
    }
    if (!SLUG_PATTERN.test(slug)) {
      setStatus("invalid");
      return;
    }
    setStatus("checking");
    const controller = new AbortController();
    const timer = setTimeout(() => {
      eventsClient
        .checkSlug(slug, controller.signal)
        .then((res) => {
          if (!controller.signal.aborted) {
            setStatus(res.available ? "available" : "taken");
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) setStatus("idle");
        });
    }, 400);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [slug]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      eventsClient
        .slugSuggestions(
          {
            partnerAName: formData.partner1Name?.trim() || undefined,
            partnerBName: formData.partner2Name?.trim() || undefined,
          },
          controller.signal,
        )
        .then((res) => {
          if (!controller.signal.aborted) setSuggestions(res.suggestions);
        })
        .catch(() => {
          if (!controller.signal.aborted) setSuggestions([]);
        });
    }, 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [formData.partner1Name, formData.partner2Name]);

  const canContinue = slug.length === 0 || status === "available";

  const generatePlaceholder = () => {
    const p1 = formData.partner1Name?.toLowerCase() || "partner1";
    const p2 = formData.partner2Name?.toLowerCase() || "partner2";
    return `${p1}-and-${p2}`;
  };

  const handlePickFile = () => inputRef.current?.click();

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/") || file.size > MAX_BYTES) return;
    if (formData.coverFilePreview) {
      URL.revokeObjectURL(formData.coverFilePreview);
    }
    const preview = URL.createObjectURL(file);
    updateFormData({
      coverType: "upload",
      coverFile: file,
      coverFilePreview: preview,
    });
  };

  const handleSelectPreset = (id: string) => {
    if (id === "upload") {
      handlePickFile();
      return;
    }
    if (formData.coverFilePreview) {
      URL.revokeObjectURL(formData.coverFilePreview);
    }
    updateFormData({
      coverType: id,
      coverFile: null,
      coverFilePreview: null,
    });
  };

  const handleSlugChange = (value: string) => {
    updateFormData({
      bookUrl: value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
    });
  };

  const handleContinue = () => {
    const accountType = formData.accountType || "couple";
    router.push(`${appRoutes.auth.signUp}?as=${accountType}`);
  };

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

        <div className="mt-4 grid grid-cols-6 gap-2">
          {COVER_OPTIONS.map((option) => (
            <CoverOption
              key={option.id}
              label={t(option.labelKey)}
              tint={option.tint}
              isUpload={option.isUpload}
              selected={formData.coverType === option.id}
              initials={`${formData.partner1Name?.[0] ?? "L"}&${formData.partner2Name?.[0] ?? "T"}`}
              onClick={() => handleSelectPreset(option.id)}
            />
          ))}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MIME}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />

        {formData.coverFile && (
          <div className="rounded-12 bg-primary/5 mt-3 flex items-center gap-3 p-2.5">
            <div className="size-8 overflow-hidden rounded-md">
              {formData.coverFilePreview && (
                <img
                  src={formData.coverFilePreview}
                  alt=""
                  className="size-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="type-caption text-foreground truncate font-semibold">
                {formData.coverFile.name}
              </p>
              <p className="type-caption text-muted-foreground">
                {t("signup__cover__file_size", {
                  size: (formData.coverFile.size / (1024 * 1024)).toFixed(1),
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={handlePickFile}
              className="type-caption text-primary cursor-pointer font-semibold"
            >
              {t("signup__cover__change")}
            </button>
          </div>
        )}

        <div className="mt-6">
          <Kicker className="text-muted-foreground mb-2">
            {t("signup__claim__your_link")}
          </Kicker>
          <div className="rounded-16 border-primary bg-card shadow-input flex items-center gap-2 border-2 px-4 py-3">
            <span className="type-body-small text-muted-foreground font-mono">
              ovation.love /
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder={generatePlaceholder()}
              className="type-body-small text-foreground placeholder:text-muted-foreground flex-1 bg-transparent font-medium outline-none"
            />
            {status === "available" && (
              <AvailableBadge label={t("signup__claim__available")} />
            )}
            {status === "checking" && (
              <span className="type-caption text-muted-foreground">
                {t("signup__claim__checking")}
              </span>
            )}
            {status === "taken" && (
              <span className="type-caption text-destructive font-semibold">
                {t("signup__claim__taken")}
              </span>
            )}
            {status === "invalid" && (
              <span className="type-caption text-destructive font-semibold">
                {t("signup__claim__invalid")}
              </span>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <UrlSuggestionChip
                  key={s}
                  slug={s}
                  onClick={() => handleSlugChange(s)}
                />
              ))}
            </div>
          )}
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
