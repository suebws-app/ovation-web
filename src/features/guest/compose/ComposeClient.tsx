"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { cn } from "@ovation/ui/utils/cn";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "@/components/Toaster";
import { WizardHeader } from "../shell/WizardHeader";
import { StickyCTA } from "../shell/StickyCTA";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { VoiceCaptureCard } from "./VoiceCaptureCard";
import { VideoCaptureCard } from "./VideoCaptureCard";
import { PhotoCaptureCard } from "./PhotoCaptureCard";
import { NoteCaptureCard } from "./NoteCaptureCard";

type ComposeClientProps = {
  slug: string;
  captureAudio: boolean;
  captureVideo: boolean;
  capturePhoto: boolean;
  maxVideoDurationSec: number;
  maxAudioDurationSec: number;
  sourceParam: string | null;
  submissionClosed: boolean;
  closedMessage: string;
};

export const ComposeClient = ({
  slug,
  captureAudio,
  captureVideo,
  capturePhoto,
  maxVideoDurationSec,
  maxAudioDurationSec,
  sourceParam,
  submissionClosed,
  closedMessage,
}: ComposeClientProps) => {
  const t = useTranslations();
  const router = useRouter();
  const isKioskSession = sourceParam === "kiosk";
  const setSlug = useGuestSubmissionStore((s) => s.setSlug);
  const audio = useGuestSubmissionStore((s) => s.audio);
  const videos = useGuestSubmissionStore((s) => s.videos);
  const photos = useGuestSubmissionStore((s) => s.photos);
  const note = useGuestSubmissionStore((s) => s.note);

  useEffect(() => {
    setSlug(slug);
  }, [slug, setSlug]);

  const totalSteps = 2;
  const sourceQuery = isKioskSession ? "?source=kiosk" : "";
  const nextHref = `/g/${slug}/review${sourceQuery}`;
  const backHref = isKioskSession ? `/kiosk/${slug}` : null;

  const hasAnyContent =
    Boolean(audio) ||
    videos.length > 0 ||
    photos.length > 0 ||
    note.trim().length > 0;

  const handleContinue = () => {
    if (submissionClosed) return;
    if (!hasAnyContent) {
      toast.error(t("guest__compose__error_missing_content"));
      return;
    }
    router.push(nextHref);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="tablet:px-8 small-desktop:px-10 small-desktop:py-9 flex flex-1 flex-col gap-6 px-5 pt-5 pb-9">
        <WizardHeader
          step={1}
          totalSteps={totalSteps}
          title={t("guest__compose__title")}
          subtitle={t("guest__compose__subtitle")}
        />
        {submissionClosed && (
          <div
            className="rounded-16 bg-warm-cream border-border border p-4.5"
            role="alert"
          >
            <p className="type-body-small text-foreground/85 text-center">
              {closedMessage}
            </p>
          </div>
        )}
        <fieldset
          disabled={submissionClosed}
          className={cn(
            "flex flex-col gap-3.5",
            submissionClosed && "pointer-events-none opacity-60",
          )}
        >
          {captureAudio && (
            <VoiceCaptureCard maxDurationSec={maxAudioDurationSec} />
          )}
          {captureVideo && (
            <VideoCaptureCard maxDurationSec={maxVideoDurationSec} />
          )}
          {capturePhoto && <PhotoCaptureCard />}
          <NoteCaptureCard />
        </fieldset>
      </div>
      <StickyCTA
        layout="split"
        className="bg-card shadow-top"
        caption={
          !submissionClosed && !hasAnyContent
            ? t("guest__compose__error_missing_content")
            : undefined
        }
        captionTone="warning"
      >
        <div className="tablet:w-auto flex w-full justify-end gap-2">
          {backHref && (
            <Button
              asChild
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
            >
              <Link href={backHref}>{t("guest__wizard__back")}</Link>
            </Button>
          )}
          <Button
            type="button"
            className={cn(
              "tablet:w-auto tablet:px-10 flex-1 shadow-lg",
              !hasAnyContent && !submissionClosed && "opacity-50",
            )}
            onClick={handleContinue}
            aria-disabled={!hasAnyContent || submissionClosed}
            disabled={submissionClosed}
          >
            {t("guest__wizard__continue")}
          </Button>
        </div>
      </StickyCTA>
    </div>
  );
};
