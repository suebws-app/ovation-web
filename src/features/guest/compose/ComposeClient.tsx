"use client";

import { useEffect, useState, startTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { cn } from "@ovation/ui/utils/cn";
import { Link, useRouter } from "@/i18n/navigation";
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
  const video = useGuestSubmissionStore((s) => s.video);
  const photos = useGuestSubmissionStore((s) => s.photos);
  const note = useGuestSubmissionStore((s) => s.note);
  const [stepError, setStepError] = useState<string | null>(null);

  useEffect(() => {
    setSlug(slug);
  }, [slug, setSlug]);

  const totalSteps = 2;
  const sourceQuery = isKioskSession ? "?source=kiosk" : "";
  const nextHref = `/g/${slug}/review${sourceQuery}`;
  const backHref = isKioskSession ? `/kiosk/${slug}` : null;

  const hasAnyContent =
    Boolean(audio || video) || photos.length > 0 || note.trim().length > 0;

  const handleContinue = () => {
    if (submissionClosed) return;
    if (!hasAnyContent) {
      setStepError(t("guest__compose__error_missing_content"));
      return;
    }
    setStepError(null);
    router.push(nextHref);
  };

  useEffect(() => {
    if (hasAnyContent) startTransition(() => setStepError(null));
  }, [hasAnyContent]);

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
        {stepError && (
          <p className="type-body-small text-destructive" role="alert">
            {stepError}
          </p>
        )}
      </div>
      <StickyCTA layout="split" caption={t("guest__compose__caption")}>
        <div className="tablet:w-auto flex w-full gap-2">
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
            className="tablet:w-auto tablet:px-10 flex-1 rounded-full shadow-lg"
            onClick={handleContinue}
            disabled={submissionClosed}
          >
            {t("guest__wizard__continue")}
          </Button>
        </div>
      </StickyCTA>
    </div>
  );
};
