"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Heart } from "@ovation/icons/Heart";
import { Download } from "@ovation/icons/Download";
import { Play } from "@ovation/icons/Play";
import { useMessageDetail } from "@/lib/query/messagesQueries";
import { formatTimeShort } from "@/features/messages/adapters";
import type { PhotoView } from "../adapters";

type DetailPaneProps = {
  eventId: string;
  photo: PhotoView | null;
  onToggleFavorite: () => void;
  togglePending: boolean;
};

export const DetailPane = ({
  eventId,
  photo,
  onToggleFavorite,
  togglePending,
}: DetailPaneProps) => {
  const t = useTranslations();
  const { data: detail } = useMessageDetail(eventId, photo?.id ?? null);

  if (!photo) {
    return (
      <div className="border-border bg-background large-desktop:flex hidden flex-col items-center justify-center gap-2 overflow-auto border-l p-8 text-center">
        <Eyebrow className="text-muted-foreground">
          {t("photos__detail__placeholder_eyebrow")}
        </Eyebrow>
        <p className="type-body-small text-muted-foreground">
          {t("photos__detail__placeholder_body")}
        </p>
      </div>
    );
  }

  const photoUrl = detail?.message.photoUrl ?? photo.thumbUrl;
  const transcript = detail?.message.transcript ?? null;

  return (
    <div className="border-border bg-background large-desktop:flex hidden flex-col gap-4 overflow-auto border-l p-5">
      <div className="rounded-16 relative overflow-hidden shadow-md">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={photo.name}
            className="block max-h-80 w-full bg-black/5 object-contain"
          />
        ) : (
          <div
            className="relative flex h-70 w-full items-center justify-center"
            style={{
              background: `linear-gradient(160deg, ${photo.tint}, ${photo.tint}bb)`,
            }}
          >
            <span className="type-display font-serif text-black/40">
              {photo.monogram}
            </span>
          </div>
        )}
      </div>

      <div className="rounded-16 border-border bg-card border p-4">
        <Eyebrow className="text-primary">
          {t("photos__detail__from_guest")}
        </Eyebrow>
        <p className="type-h4 mt-1 font-serif leading-snug font-semibold">
          {photo.name}
        </p>
        <p className="type-caption text-muted-foreground mt-1.5">
          {formatTimeShort(photo.createdAt)}
          {photo.hasAudio && photo.audioDuration && (
            <> · {photo.audioDuration} audio</>
          )}
        </p>
      </div>

      {photo.hasAudio && (
        <div className="rounded-16 bg-foreground text-background relative overflow-hidden p-3.5">
          <Eyebrow className="tracking-[1.5px] opacity-70">
            {t("photos__detail__paired_audio")}
          </Eyebrow>
          <div className="mt-2.5 flex items-center gap-2.5">
            <button
              type="button"
              className="bg-destructive text-primary-foreground flex size-9.5 shrink-0 cursor-pointer items-center justify-center rounded-full border-none shadow-[0_0_0_5px_oklch(0.723_0.135_40/0.15)]"
            >
              <Play width={12} height={12} />
            </button>
            <p className="type-body-small font-mono opacity-70">
              {photo.audioDuration}
            </p>
          </div>
          {transcript && (
            <p className="type-body-small mt-2.5 font-serif italic opacity-90">
              &ldquo;{transcript.slice(0, 140)}
              {transcript.length > 140 ? "…" : ""}&rdquo;
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="rounded-12"
          onClick={onToggleFavorite}
          disabled={togglePending}
        >
          <Heart
            width={14}
            height={14}
            className={
              photo.favorited ? "fill-destructive text-destructive" : ""
            }
          />
          {photo.favorited
            ? t("photos__detail__favourited")
            : t("photos__detail__favourite")}
        </Button>
        <Button asChild variant="outline" className="rounded-12">
          <a
            href={photoUrl ?? "#"}
            download={photoUrl ? `${photo.name}.jpg` : undefined}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download width={14} height={14} /> {t("photos__detail__download")}
          </a>
        </Button>
      </div>
    </div>
  );
};
