"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { useRouter } from "@/i18n/navigation";
import { WizardHeader } from "../shell/WizardHeader";
import { StickyCTA } from "../shell/StickyCTA";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { KioskFullscreenGuard } from "@/features/kiosk-setup/components/KioskFullscreenGuard";
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
  exitPin: string | null;
  fullscreenLock: boolean;
  sourceParam: string | null;
};

export const ComposeClient = ({
  slug,
  captureAudio,
  captureVideo,
  capturePhoto,
  maxVideoDurationSec,
  maxAudioDurationSec,
  exitPin,
  fullscreenLock,
  sourceParam,
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
  const backHref = isKioskSession ? `/kiosk/${slug}` : `/g/${slug}`;

  const hasAnyContent =
    Boolean(audio || video) || photos.length > 0 || note.trim().length > 0;

  const handleContinue = () => {
    if (!hasAnyContent) {
      setStepError(t("guest__compose__error_missing_content"));
      return;
    }
    setStepError(null);
    router.push(nextHref);
  };

  useEffect(() => {
    if (hasAnyContent) setStepError(null);
  }, [hasAnyContent]);

  return (
    <div className="flex flex-1 flex-col">
      <KioskFullscreenGuard
        active={isKioskSession && fullscreenLock}
        exitPin={exitPin}
        exitHref="/kiosk"
      />
      <div className="flex flex-1 flex-col gap-6 px-5 pt-5 pb-9 tablet:px-8 small-desktop:px-10 small-desktop:py-9">
        <WizardHeader
          backHref={backHref}
          step={1}
          totalSteps={totalSteps}
          title={t("guest__compose__title")}
          subtitle={t("guest__compose__subtitle")}
        />
        <div className="flex flex-col gap-3.5">
          {captureAudio && (
            <VoiceCaptureCard maxDurationSec={maxAudioDurationSec} />
          )}
          {captureVideo && (
            <VideoCaptureCard maxDurationSec={maxVideoDurationSec} />
          )}
          {capturePhoto && <PhotoCaptureCard />}
          <NoteCaptureCard />
        </div>
        {stepError && (
          <p className="type-body-small text-destructive" role="alert">
            {stepError}
          </p>
        )}
      </div>
      <StickyCTA caption={t("guest__compose__caption")}>
        <Button
          type="button"
          size="lg"
          className="w-full rounded-full shadow-lg"
          onClick={handleContinue}
        >
          {t("guest__wizard__continue")}
          <ArrowRightIcon width={16} height={16} />
        </Button>
      </StickyCTA>
    </div>
  );
};
