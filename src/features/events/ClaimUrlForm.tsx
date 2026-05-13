"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Kicker } from "@ovation/ui/components/Kicker";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { InfoIcon } from "@ovation/icons/InfoIcon";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { env } from "@/lib/utils/env";
import { PhoneMockup } from "@/features/auth/SignUp/components/PhoneMockup";
import { UrlSuggestionChip } from "@/features/auth/SignUp/components/UrlSuggestionChip";
import { AvailableBadge } from "@/features/auth/SignUp/components/AvailableBadge";
import { eventsClient } from "@/lib/api/events-client";

type SlugStatus = "idle" | "invalid" | "checking" | "available" | "taken";

const SLUG_PATTERN = /^[a-z0-9-]{4,20}$/;

type ClaimUrlFormProps = {
  partner1Name: string;
  partner2Name: string;
  weddingDate: Date | null;
  venue: string;
  bookUrl: string;
  onBookUrlChange: (url: string) => void;
  onContinue: () => void;
  headerSlot?: React.ReactNode;
  className?: string;
};

export const ClaimUrlForm = ({
  partner1Name,
  partner2Name,
  weddingDate,
  venue,
  bookUrl,
  onBookUrlChange,
  onContinue,
  headerSlot,
  className,
}: ClaimUrlFormProps) => {
  const t = useTranslations();
  const slug = bookUrl || "";
  const [status, setStatus] = useState<SlugStatus>("idle");

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

  const canContinue = slug.length === 0 || status === "available";

  const generateSlug = () => {
    const p1 = partner1Name?.toLowerCase() || "partner1";
    const p2 = partner2Name?.toLowerCase() || "partner2";
    return `${p1}-and-${p2}`;
  };

  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      eventsClient
        .slugSuggestions(
          {
            partnerAName: partner1Name?.trim() || undefined,
            partnerBName: partner2Name?.trim() || undefined,
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
  }, [partner1Name, partner2Name]);

  return (
    <AuthSplitLayout
      className={className}
      panel={
        <>
          <Kicker className="relative tracking-[2.5px] opacity-80">
            {t("signup__claim__brand_eyebrow")}
          </Kicker>
          <div className="relative">
            <p className="type-h1 leading-tight tracking-tight italic">
              {t("signup__claim__brand_lead_a")}{" "}
              <span className="text-primary-foreground italic">
                {t("signup__claim__brand_lead_b")}
              </span>
            </p>
          </div>
          <PhoneMockup
            url={slug || generateSlug()}
            partner1={partner1Name || t("signup__book_details__partner1")}
            partner2={partner2Name || t("signup__book_details__partner2")}
            date={weddingDate?.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            venue={venue}
          />
        </>
      }
    >
      <>
        {headerSlot}
        <h1 className="type-h1 leading-tight font-semibold tracking-tight">
          {t("signup__claim__title_a")}
          <br />
          <span className="text-primary italic">
            {t("signup__claim__title_b")}
          </span>
        </h1>
        <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
          {t("signup__claim__subtitle")}
        </p>

        <div className="mt-6.5">
          <Kicker className="text-muted-foreground mb-2">
            {t("signup__claim__your_link")}
          </Kicker>
          <div className="rounded-16 border-primary bg-card shadow-input flex items-center gap-2 border-2 px-4 py-3.5">
            <span className="type-body-small text-muted-foreground font-mono">
              {env.APP_URL} /
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) =>
                onBookUrlChange(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                )
              }
              placeholder={generateSlug()}
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
          <p className="type-caption text-muted-foreground mt-2">
            {t("signup__claim__hint")}
          </p>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-5.5">
            <Kicker className="text-muted-foreground mb-2.5">
              {t("signup__claim__try_one")}
            </Kicker>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <UrlSuggestionChip
                  key={s}
                  slug={s}
                  onClick={() => onBookUrlChange(s)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="rounded-12 bg-primary/10 mt-8 flex items-start gap-2.5 p-3.5">
          <InfoIcon
            width={18}
            height={18}
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
          onClick={onContinue}
          disabled={!canContinue}
          size="lg"
          className="shadow-primary/40 mt-6 w-full rounded-full shadow-md"
        >
          {t("signup__claim__continue")}
          <ArrowRightIcon width={16} height={16} />
        </Button>
      </>
    </AuthSplitLayout>
  );
};
