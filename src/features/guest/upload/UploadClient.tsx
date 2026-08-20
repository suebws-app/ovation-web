"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MicIcon } from "@ovation/icons/MicIcon";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";
import { Button } from "@ovation/ui/components/Button";
import { toast } from "@/components/Toaster";
import { useRouter } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { PhotoThumb } from "../compose/PhotoThumb";
import { readStoredGuestName } from "../welcome/guestNameStorage";
import { AddActionTile } from "./AddActionTile";
import { UploadHeader } from "./UploadHeader";
import { MediaDropZone } from "./MediaDropZone";
import { VoiceRecordSheet } from "./VoiceRecordSheet";
import { TextPostSheet } from "./TextPostSheet";
import { UploadProgressRow } from "./UploadProgressRow";
import { RecordedVoiceRow } from "./RecordedVoiceRow";
import { TextPostPreview } from "./TextPostPreview";
import { useMediaPicker } from "./useMediaPicker";
import { useGuestSubmit } from "./useGuestSubmit";

type UploadClientProps = {
  slug: string;
  title: string;
  initials: string;
  avatarUrl: string | null;
  captureAudio: boolean;
  maxAudioDurationSec: number;
  maxVideoDurationSec: number;
  sourceParam: string | null;
  submissionClosed: boolean;
  closedMessage: string;
};

export const UploadClient = ({
  slug,
  title,
  initials,
  avatarUrl,
  captureAudio,
  maxAudioDurationSec,
  maxVideoDurationSec,
  sourceParam,
  submissionClosed,
  closedMessage,
}: UploadClientProps) => {
  const t = useTranslations();
  const router = useRouter();
  const setSlug = useGuestSubmissionStore((s) => s.setSlug);
  const photos = useGuestSubmissionStore((s) => s.photos);
  const videos = useGuestSubmissionStore((s) => s.videos);
  const audio = useGuestSubmissionStore((s) => s.audio);
  const note = useGuestSubmissionStore((s) => s.note);
  const removePhoto = useGuestSubmissionStore((s) => s.removePhoto);
  const guestName = useGuestSubmissionStore((s) => s.guestName);
  const setGuestName = useGuestSubmissionStore((s) => s.setGuestName);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const { pick, isProcessing, error } = useMediaPicker(maxVideoDurationSec);
  const { phase, items, isInFlight, submit, retryFailed } = useGuestSubmit(
    slug,
    sourceParam,
  );

  useEffect(() => {
    setSlug(slug);
    if (guestName.trim().length > 0) return;

    const stored = readStoredGuestName(slug);
    if (stored) {
      setGuestName(stored);
      return;
    }

    const source = sourceParam ? `&source=${sourceParam}` : "";
    router.replace(`${appRoutes.guest.base(slug)}?next=upload${source}`);
  }, [slug, setSlug, guestName, setGuestName, sourceParam, router]);

  const hasNote = note.trim().length > 0;
  const hasAnyContent =
    Boolean(audio) || videos.length > 0 || photos.length > 0 || hasNote;
  const showProgress = phase !== "idle";

  const handleSend = () => {
    if (submissionClosed) {
      toast.error(closedMessage);
      return;
    }
    if (!hasAnyContent) {
      toast.error(t("guest__compose__error_missing_content"));
      return;
    }
    void submit();
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-150 flex-col gap-6 px-5 py-6">
      <UploadHeader
        slug={slug}
        title={title}
        initials={initials}
        avatarUrl={avatarUrl}
      />

      <MediaDropZone onFiles={pick} isProcessing={isProcessing} />
      {error && (
        <p className="type-body-small text-destructive" role="alert">
          {error}
        </p>
      )}

      {(photos.length > 0 || videos.length > 0) && (
        <div className="flex flex-col gap-2">
          {photos.length > 0 && (
            <div className="small-desktop:grid-cols-6 grid grid-cols-4 gap-2">
              {photos.map((photo) => (
                <PhotoThumb
                  key={photo.id}
                  photo={photo}
                  onRemove={() => removePhoto(photo.id)}
                  removeLabel={t("guest__upload__remove_photo")}
                />
              ))}
            </div>
          )}
          {videos.length > 0 && (
            <p className="type-body-small text-muted-foreground">
              {t("guest__upload__videos_added", { count: videos.length })}
            </p>
          )}
        </div>
      )}

      <RecordedVoiceRow />
      <TextPostPreview onEdit={() => setNoteOpen(true)} />

      {(captureAudio && !audio) || !hasNote ? (
        <div className="flex gap-3">
          {captureAudio && !audio && (
            <AddActionTile
              tone="voice"
              icon={<MicIcon width={18} height={18} aria-hidden />}
              title={t("guest__upload__voice_tile")}
              hint={t("guest__compose__voice_subtitle", {
                seconds: maxAudioDurationSec,
              })}
              onClick={() => setVoiceOpen(true)}
            />
          )}
          {!hasNote && (
            <AddActionTile
              tone="text"
              icon={<MessageSquareIcon width={18} height={18} aria-hidden />}
              title={t("guest__upload__note_tile")}
              hint={t("guest__compose__note_subtitle")}
              onClick={() => setNoteOpen(true)}
            />
          )}
        </div>
      ) : null}

      {showProgress && (
        <div className="bg-card/70 rounded-16 flex flex-col gap-4 p-4">
          <p className="type-body-small text-foreground font-semibold">
            {phase === "success"
              ? t("guest__upload__sent")
              : phase === "sending"
                ? t("guest__upload__sending")
                : t("guest__upload__uploading")}
          </p>
          {items.map((item) => (
            <UploadProgressRow key={item.id} item={item} />
          ))}
          {phase === "awaiting_retry" && (
            <Button variant="outline" onClick={() => void retryFailed()}>
              {t("guest__upload__retry")}
            </Button>
          )}
        </div>
      )}

      <Button
        size="lg"
        onClick={handleSend}
        disabled={!hasAnyContent || isInFlight || phase === "success"}
        className="mt-auto w-full"
      >
        {t("guest__upload__send")}
      </Button>

      <VoiceRecordSheet
        open={voiceOpen}
        maxDurationSec={maxAudioDurationSec}
        onOpenChange={setVoiceOpen}
      />
      <TextPostSheet open={noteOpen} onOpenChange={setNoteOpen} />
    </div>
  );
};
