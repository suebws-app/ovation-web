"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { ApiError } from "@/lib/api/client";
import { publicClient } from "@/lib/api/public-client";
import { uploadToTarget } from "@/lib/media/uploadToTarget";
import { useIdleTimeout } from "@/lib/hooks/useIdleTimeout";
import type { UploadTarget } from "@/lib/api/types";
import { AudioPanel } from "./AudioPanel";
import { NotePanel } from "./NotePanel";
import { PhotoPanel, type PhotoSelection } from "./PhotoPanel";
import { VideoPanel } from "./VideoPanel";
import { useAudioRecorder } from "./useAudioRecorder";
import { useVideoRecorder } from "./useVideoRecorder";
import { SectionPicker, type SectionKey } from "./SectionPicker";

type RecorderClientProps = {
  slug: string;
  themeColor: string;
  defaultLanguage: string;
};

const findTarget = (
  targets: UploadTarget[],
  kind: "audio" | "video" | "photo",
): UploadTarget | undefined => targets.find((target) => target.kind === kind);

const newIdempotencyKey = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const readSubmissionSource = (
  raw: string | null,
): "kiosk" | "qr_scan" | "direct_link" => {
  if (raw === "kiosk") return "kiosk";
  if (raw === "qr_scan") return "qr_scan";
  return "direct_link";
};

export const RecorderClient = ({
  slug,
  themeColor,
  defaultLanguage,
}: RecorderClientProps) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionSource = readSubmissionSource(searchParams.get("source"));
  const [name, setName] = useState("");
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    () => new Set<SectionKey>(["audio"]),
  );
  const [photo, setPhoto] = useState<PhotoSelection | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [progressLabel, setProgressLabel] = useState<string | null>(null);
  const [idempotencyKey] = useState(newIdempotencyKey);

  const audioRecorder = useAudioRecorder();
  const videoRecorder = useVideoRecorder();

  useIdleTimeout(
    90_000,
    () => {
      router.replace(`/kiosk/${slug}`);
    },
    submissionSource === "kiosk" && !submitting,
  );

  const isOpen = (key: SectionKey) => openSections.has(key);
  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const hasAudio = isOpen("audio") && audioRecorder.recording !== null;
  const hasVideo = isOpen("video") && videoRecorder.recording !== null;
  const hasPhoto = isOpen("photo") && photo !== null;
  const hasNote = isOpen("note") && note.trim().length > 0;
  const hasAnyContent = hasAudio || hasVideo || hasPhoto || hasNote;

  const canSubmit = name.trim().length > 0 && hasAnyContent && !submitting;

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const audioBlob = hasAudio ? audioRecorder.recording!.blob : null;
      const audioMime = hasAudio ? audioRecorder.recording!.mimeType : null;
      const videoBlob = hasVideo ? videoRecorder.recording!.blob : null;
      const videoMime = hasVideo ? videoRecorder.recording!.mimeType : null;
      const photoFile = hasPhoto ? photo!.file : null;

      let audioKey: string | null = null;
      let videoKey: string | null = null;
      let photoKey: string | null = null;

      const needUpload = audioBlob || videoBlob || photoFile;
      if (needUpload) {
        setProgressLabel(t("guest__record__progress_preparing"));
        const uploadResult = await publicClient.uploadUrls(slug, {
          audioContentType: audioBlob ? audioMime : null,
          videoContentType: videoBlob ? videoMime : null,
          photoContentType: photoFile ? photoFile.type : null,
        });

        if (audioBlob) {
          const target = findTarget(uploadResult.uploadTargets, "audio");
          if (!target)
            throw new Error(t("guest__record__error_no_audio_target"));
          setProgressLabel(t("guest__record__progress_audio"));
          await uploadToTarget(target, audioBlob);
          audioKey = target.key;
        }
        if (videoBlob) {
          const target = findTarget(uploadResult.uploadTargets, "video");
          if (!target)
            throw new Error(t("guest__record__error_no_video_target"));
          setProgressLabel(t("guest__record__progress_video"));
          await uploadToTarget(target, videoBlob);
          videoKey = target.key;
        }
        if (photoFile) {
          const target = findTarget(uploadResult.uploadTargets, "photo");
          if (!target)
            throw new Error(t("guest__record__error_no_photo_target"));
          setProgressLabel(t("guest__record__progress_photo"));
          await uploadToTarget(target, photoFile);
          photoKey = target.key;
        }
      }

      setProgressLabel(t("guest__record__progress_sending"));
      await publicClient.createMessage(slug, idempotencyKey, {
        guestNames: name.trim(),
        audioKey,
        audioDurationSec: hasAudio
          ? audioRecorder.recording!.durationSec
          : null,
        audioMimeType: hasAudio ? audioMime : null,
        videoKey,
        videoDurationSec: hasVideo
          ? videoRecorder.recording!.durationSec
          : null,
        videoMimeType: hasVideo ? videoMime : null,
        photoKey,
        photoWidth: hasPhoto ? photo!.width : null,
        photoHeight: hasPhoto ? photo!.height : null,
        writtenNote: hasNote ? note.trim() : null,
        submissionSource,
        submissionLanguage: defaultLanguage,
        clientCreatedAt: new Date().toISOString(),
      });

      const successHref =
        submissionSource === "kiosk"
          ? `/kiosk/${slug}?submitted=1`
          : `/g/${slug}/thank-you`;
      router.replace(successHref);
    } catch (error) {
      setSubmitError(
        ApiError.isApiError(error)
          ? error.message
          : error instanceof Error
            ? error.message
            : t("guest__record__error_default"),
      );
    } finally {
      setSubmitting(false);
      setProgressLabel(null);
    }
  };

  return (
    <div
      className="min-h-screen pb-20"
      style={{
        background: `linear-gradient(160deg, ${themeColor} 0%, oklch(0.97 0.015 80) 100%)`,
      }}
    >
      <main className="mx-auto flex w-full max-w-160 flex-col gap-6 px-6 py-10">
        <div>
          <Eyebrow className="text-foreground/70 tracking-[2px]">
            {t("guest__record__eyebrow")}
          </Eyebrow>
          <h1 className="type-h1 mt-2 font-serif leading-tight font-semibold tracking-tight">
            {t("guest__record__title_a")}{" "}
            <span className="text-primary italic">
              {t("guest__record__title_b")}
            </span>
          </h1>
          <p className="type-body-small text-foreground/70 mt-2">
            {t("guest__record__subtitle")}
          </p>
        </div>

        <div className="rounded-16 bg-card border-border border p-5">
          <Label htmlFor="guest-name" className="mb-2">
            {t("guest__record__name_label")}
          </Label>
          <Input
            id="guest-name"
            type="text"
            autoComplete="name"
            placeholder={t("guest__record__name_placeholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <SectionPicker
          openSections={openSections}
          onToggle={toggleSection}
          filled={{
            audio: hasAudio,
            video: hasVideo,
            photo: hasPhoto,
            note: hasNote,
          }}
        />

        {isOpen("audio") && <AudioPanel recorder={audioRecorder} />}
        {isOpen("video") && <VideoPanel recorder={videoRecorder} />}
        {isOpen("photo") && <PhotoPanel photo={photo} onChange={setPhoto} />}
        {isOpen("note") && <NotePanel value={note} onChange={setNote} />}

        {submitError && (
          <p className="type-body-small text-destructive" role="alert">
            {submitError}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            size="lg"
            className="rounded-full shadow-lg"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {submitting
              ? (progressLabel ?? t("guest__record__sending"))
              : t("guest__record__send")}
          </Button>
          <p className="type-caption text-foreground/60 text-center">
            {t("guest__record__caption")}
          </p>
        </div>
      </main>
    </div>
  );
};
