"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { LockIcon } from "@ovation/icons/LockIcon";
import { LogOutIcon } from "@ovation/icons/LogOutIcon";
import type { PublicEvent } from "@/lib/api/types";
import { useFullscreen } from "@/lib/hooks/useFullscreen";
import { useWakeLock } from "@/lib/hooks/useWakeLock";
import { KioskLiveLanguagePopover } from "./KioskLiveLanguagePopover";
import { KioskFullscreenGuard } from "./KioskFullscreenGuard";
import { KioskExitDialog } from "./KioskExitDialog";
import { KioskOfflineOverlay } from "@/features/kiosk/components/KioskOfflineOverlay";

type KioskLiveFrameProps = {
  slug: string;
  event: PublicEvent;
  exitHref?: string;
  enableWakeLock?: boolean;
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
  exitHref = "/",
  enableWakeLock = false,
}: KioskLiveFrameProps) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const searchParams = useSearchParams();
  const dateLabel = formatWeddingDate(event.weddingDate);
  const recordHref = `/g/${slug}/record?source=kiosk`;
  const handleStart = () => router.push(recordHref);
  const isClosed = !event.submissionOpen || event.limitReached;
  const showThanks = searchParams.get("submitted") === "1";
  const [exitOpen, setExitOpen] = useState(false);
  const leaveOnConfirmRef = useRef(false);
  const skipNextGuardRef = useRef(false);
  const showLanguagePicker =
    event.kiosk.welcomeShowLanguagePicker &&
    event.supportedLanguages.length > 1;

  const handleLanguageSelect = (lang: string) => {
    if (lang === currentLocale) return;
    router.replace(pathname, { locale: lang });
  };

  const {
    isFullscreen,
    isSupported: fullscreenSupported,
    enter: enterFullscreen,
    exit: exitFullscreen,
  } = useFullscreen();

  const clearKioskSession = () => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.removeItem(`kiosk-access:${slug}`);
    } catch {
      // ignore
    }
  };

  const handleExitClick = async () => {
    const shouldLeave = !isFullscreen;
    if (event.kiosk.requiresPin) {
      leaveOnConfirmRef.current = shouldLeave;
      setExitOpen(true);
      return;
    }
    if (isFullscreen) {
      skipNextGuardRef.current = true;
    }
    try {
      await exitFullscreen();
    } catch {
      // ignore
    }
    if (shouldLeave) {
      clearKioskSession();
      router.push(exitHref);
    }
  };

  const handleManualExitConfirm = async () => {
    setExitOpen(false);
    const shouldLeave = leaveOnConfirmRef.current;
    leaveOnConfirmRef.current = false;
    if (isFullscreen) {
      skipNextGuardRef.current = true;
    }
    try {
      await exitFullscreen();
    } catch {
      // ignore
    }
    if (shouldLeave) {
      clearKioskSession();
      router.push(exitHref);
    }
  };

  useWakeLock(enableWakeLock);

  useEffect(() => {
    if (!showThanks) return;
    const timeout = setTimeout(() => {
      router.replace(`/kiosk/${slug}`);
    }, 4000);
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

      <KioskOfflineOverlay />
      <KioskFullscreenGuard
        active={enableWakeLock && fullscreenSupported}
        slug={slug}
        requiresPin={event.kiosk.requiresPin}
        skipNextExitRef={skipNextGuardRef}
      />
      <KioskExitDialog
        open={exitOpen}
        slug={slug}
        requiresPin={event.kiosk.requiresPin}
        onCancel={() => setExitOpen(false)}
        onConfirm={handleManualExitConfirm}
      />

      {showThanks && (
        <div className="pointer-events-none fixed top-6 left-1/2 z-40 -translate-x-1/2">
          <div className="rounded-16 bg-foreground text-background type-body-small flex items-center gap-2.5 px-5 py-3 font-semibold shadow-lg">
            <span className="bg-secondary inline-flex size-2 rounded-full" />
            {t("kiosk__toast__sent")}
          </div>
        </div>
      )}

      <div className="type-caption text-muted-foreground tablet:px-7 tablet:py-5 relative z-10 flex items-center px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-6 bg-primary type-caption text-primary-foreground flex size-5.5 items-center justify-center font-serif font-bold">
            O
          </div>
          <span className="text-foreground font-semibold">
            {t("kiosk__live__mode")}
          </span>
          <span className="opacity-50">&middot;</span>
          <span className="inline-flex items-center gap-1">
            <LockIcon width={11} height={11} /> {t("kiosk__live__locked")}
          </span>
        </div>
      </div>

      <div className="type-caption tablet:top-5 tablet:right-7 fixed top-3 right-3 z-[60] flex items-center gap-2">
        {enableWakeLock && fullscreenSupported && !isFullscreen && (
          <button
            type="button"
            onClick={enterFullscreen}
            className="border-border bg-card/70 type-caption hover:bg-card cursor-pointer rounded-full border px-3 py-1.5 font-semibold shadow-sm transition-colors"
          >
            {t("kiosk__live__go_fullscreen")}
          </button>
        )}
        <button
          type="button"
          onClick={handleExitClick}
          aria-label={t("kiosk__exit__button")}
          className="border-border bg-card/90 type-caption hover:bg-card inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 font-semibold shadow-sm transition-colors"
        >
          <LogOutIcon width={12} height={12} />
          {t("kiosk__exit__button")}
        </button>
      </div>

      <div className="tablet:px-20 hide-scrollbar relative z-10 flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 py-8 text-center">
        <div className="m-auto flex w-full max-w-full flex-col items-center">
          <div className="type-overline text-primary tracking-widest">
            {t("kiosk__live__welcome_overline")}
          </div>

          <h1
            className="mt-3.5 w-full max-w-full text-center font-serif leading-none font-semibold tracking-tight break-words"
            style={{ fontSize: "clamp(2.5rem, 12vw, 96px)" }}
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
            <p className="tablet:mt-9 tablet:text-2xl mt-6 max-w-xl font-serif text-lg leading-snug italic">
              &ldquo;{event.welcomeMessage}&rdquo;
            </p>
          )}

          <button
            type="button"
            onClick={handleStart}
            disabled={isClosed}
            className="border-card bg-destructive text-card type-h3 motion-safe:animate-tap-pulse tablet:mt-13 tablet:border-4 tablet:px-12 tablet:py-6 relative mt-10 flex cursor-pointer items-center justify-center rounded-full border-2 px-9 py-5 font-semibold tracking-tight shadow-lg disabled:opacity-50"
            style={{
              boxShadow:
                "0 20px 50px oklch(0.72 0.14 40 / 0.45), 0 0 0 1px oklch(0.72 0.14 40 / 0.18)",
            }}
          >
            <span
              className="border-destructive/40 tablet:-inset-6 pointer-events-none absolute -inset-4 rounded-full border-2 motion-safe:animate-pulse"
              aria-hidden
            />
            <span
              className="border-destructive/25 tablet:-inset-12 pointer-events-none absolute -inset-8 rounded-full border motion-safe:animate-pulse"
              aria-hidden
              style={{ animationDelay: "0.6s" }}
            />
            <span className="relative">
              {isClosed ? t("kiosk__live__closed") : t("kiosk__tap_to_start")}
            </span>
          </button>
          <div className="type-body-small text-muted-foreground tablet:mt-10 mt-6">
            {t("kiosk__live__caption", {
              seconds: Math.max(
                event.kiosk.maxVideoDurationSeconds,
                event.kiosk.maxAudioDurationSeconds,
              ),
            })}
          </div>
        </div>
      </div>

      {showLanguagePicker && (
        <div className="relative z-10 flex items-center justify-end px-7 py-5.5">
          <KioskLiveLanguagePopover
            languages={event.supportedLanguages}
            currentLocale={currentLocale}
            onSelect={handleLanguageSelect}
          />
        </div>
      )}
    </div>
  );
};
