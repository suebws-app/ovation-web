"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mic } from "@ovation/icons/Mic";
import { Lock } from "@ovation/icons/Lock";
import { Finger } from "@ovation/icons/Finger";
import type { PublicEvent } from "@/lib/api/types";
import { useFullscreen } from "@/lib/hooks/useFullscreen";
import { useWakeLock } from "@/lib/hooks/useWakeLock";
import { KioskLiveLanguagePill } from "./KioskLiveLanguagePill";

type KioskLiveFrameProps = {
  slug: string;
  event: PublicEvent;
  enableWakeLock?: boolean;
};

const LANGUAGE_LABELS: Record<string, { flag: string; label: string }> = {
  en: { flag: "\uD83C\uDDEC\uD83C\uDDE7", label: "English" },
  fr: { flag: "\uD83C\uDDEB\uD83C\uDDF7", label: "Français" },
  nl: { flag: "\uD83C\uDDF3\uD83C\uDDF1", label: "Nederlands" },
  de: { flag: "\uD83C\uDDE9\uD83C\uDDEA", label: "Deutsch" },
  es: { flag: "\uD83C\uDDEA\uD83C\uDDF8", label: "Español" },
  it: { flag: "\uD83C\uDDEE\uD83C\uDDF9", label: "Italiano" },
  pt: { flag: "\uD83C\uDDF5\uD83C\uDDF9", label: "Português" },
};

const formatWeddingDate = (raw: string | null): string => {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d
    .toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
};

export const KioskLiveFrame = ({
  slug,
  event,
  enableWakeLock = false,
}: KioskLiveFrameProps) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateLabel = formatWeddingDate(event.weddingDate);
  const recordHref = `/g/${slug}/record?source=kiosk`;
  const handleStart = () => router.push(recordHref);
  const isClosed = !event.submissionOpen || event.limitReached;
  const [showThanks, setShowThanks] = useState(
    () => searchParams.get("submitted") === "1",
  );
  const coupleName = `${event.partnerAName} & ${event.partnerBName}`;

  const {
    isFullscreen,
    isSupported: fullscreenSupported,
    enter: enterFullscreen,
  } = useFullscreen();

  useWakeLock(enableWakeLock);

  useEffect(() => {
    if (!showThanks) return;
    const timeout = setTimeout(() => {
      setShowThanks(false);
      router.replace(`/kiosk/${slug}`);
    }, 3500);
    return () => clearTimeout(timeout);
  }, [showThanks, router, slug]);

  return (
    <div
      className="relative flex size-full flex-col overflow-hidden"
      style={{
        background: `radial-gradient(circle at 20% 30%, ${event.themeColor}40, transparent 50%), radial-gradient(circle at 80% 75%, ${event.themeColor}55, transparent 50%), linear-gradient(180deg, #F9F7F4, #EEE6DC)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 6px, rgba(0,0,0,0.02) 6px 7px)",
        }}
      />

      {showThanks && (
        <div className="bg-foreground/85 absolute inset-0 z-30 flex flex-col items-center justify-center text-center backdrop-blur-sm">
          <div className="rounded-20 bg-secondary/20 inline-flex size-24 items-center justify-center">
            <Mic
              width={48}
              height={48}
              className="text-secondary"
              strokeWidth={1.8}
            />
          </div>
          <p className="text-background mt-9 font-serif text-5xl leading-tight font-semibold">
            {t("kiosk__live__thank_you_title")}
          </p>
          <p className="text-background/75 mt-3 max-w-md font-serif text-xl italic">
            {t("kiosk__live__thank_you_body", { names: coupleName })}
          </p>
        </div>
      )}

      <div className="type-caption text-muted-foreground relative z-10 flex items-center justify-between px-7 py-5">
        <div className="flex items-center gap-2.5">
          <div className="rounded-6 bg-primary type-caption text-primary-foreground flex size-5.5 items-center justify-center font-serif font-bold">
            O
          </div>
          <span className="text-foreground font-semibold">
            {t("kiosk__live__mode")}
          </span>
          <span className="opacity-50">&middot;</span>
          <span className="inline-flex items-center gap-1">
            <Lock width={11} height={11} /> {t("kiosk__live__locked")}
          </span>
        </div>
        {enableWakeLock && fullscreenSupported && !isFullscreen && (
          <button
            type="button"
            onClick={enterFullscreen}
            className="border-border bg-card/70 type-caption hover:bg-card cursor-pointer rounded-full border px-3 py-1.5 font-semibold transition-colors"
          >
            {t("kiosk__live__go_fullscreen")}
          </button>
        )}
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-20 text-center">
        <div className="type-overline text-primary tracking-widest">
          {t("kiosk__live__welcome_overline")}
        </div>
        <h1
          className="mt-3.5 font-serif leading-none font-semibold tracking-tight"
          style={{ fontSize: 96 }}
        >
          {event.partnerAName}{" "}
          <span className="text-primary italic">&amp;</span>{" "}
          {event.partnerBName}
        </h1>
        {dateLabel && (
          <div className="type-body-small text-muted-foreground mt-2.5 font-semibold tracking-widest">
            {dateLabel}
          </div>
        )}

        {event.welcomeMessage && (
          <p className="mt-9 max-w-xl font-serif text-2xl leading-snug italic">
            &ldquo;{event.welcomeMessage}&rdquo;
          </p>
        )}

        <button
          type="button"
          onClick={handleStart}
          disabled={isClosed}
          className="border-card bg-destructive relative mt-13 flex size-35 cursor-pointer items-center justify-center rounded-full border-8 shadow-lg disabled:opacity-50"
          style={{
            boxShadow:
              "0 20px 50px oklch(0.72 0.14 40 / 0.45), 0 0 0 1px oklch(0.72 0.14 40 / 0.18)",
          }}
        >
          <div className="border-destructive/40 pointer-events-none absolute -inset-10 rounded-full border-2 opacity-50" />
          <div className="border-destructive/25 pointer-events-none absolute -inset-18 rounded-full border opacity-35" />
          <Mic width={54} height={54} className="text-card" strokeWidth={1.8} />
        </button>
        <div className="type-body mt-5 font-semibold">
          {isClosed
            ? t("kiosk__live__closed")
            : t("kiosk__live__tap_to_record")}
        </div>
        <div className="type-body-small text-muted-foreground mt-1">
          {t("kiosk__live__caption")}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between px-7 py-5.5">
        <div className="flex flex-wrap gap-2">
          {event.supportedLanguages.map((lang) => {
            const meta = LANGUAGE_LABELS[lang] ?? {
              flag: "\uD83C\uDF10",
              label: lang.toUpperCase(),
            };
            return (
              <KioskLiveLanguagePill
                key={lang}
                flag={meta.flag}
                label={meta.label}
                active={lang === event.defaultLanguage}
              />
            );
          })}
        </div>
        <div className="type-caption text-muted-foreground flex items-center gap-2">
          <Finger width={13} height={13} />
          {t("kiosk__live__exit_hint")}
        </div>
      </div>
    </div>
  );
};
