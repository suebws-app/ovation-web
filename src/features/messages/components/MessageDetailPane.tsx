"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { Download } from "@ovation/icons/Download";
import { Heart } from "@ovation/icons/Heart";
import { Play } from "@ovation/icons/Play";
import { Star } from "@ovation/icons/Star";
import { Waveform } from "@/features/dashboard/components/Waveform";
import { useMessageDetail } from "@/lib/query/messagesQueries";
import { formatTimeShort } from "../adapters";

import type { MessageRowView } from "../adapters";

type MessageDetailPaneProps = {
  eventId: string;
  message: MessageRowView | null;
  onToggleFavorite: () => void;
  togglePending: boolean;
};

export const MessageDetailPane = ({
  eventId,
  message,
  onToggleFavorite,
  togglePending,
}: MessageDetailPaneProps) => {
  const t = useTranslations();
  const { data: detail } = useMessageDetail(eventId, message?.id ?? null);

  if (!message) {
    return (
      <div className="border-border bg-background small-desktop:flex hidden flex-col items-center justify-center gap-2 overflow-auto border-l p-8 text-center">
        <Eyebrow className="text-muted-foreground">
          {t("messages__detail__placeholder_eyebrow")}
        </Eyebrow>
        <p className="type-body-small text-muted-foreground">
          {t("messages__detail__placeholder_body")}
        </p>
      </div>
    );
  }

  const transcript =
    detail?.message.transcript ??
    message.quote ??
    t("messages__detail__transcript_unavailable");
  const fullDuration = message.duration;
  const recordedAt = formatTimeShort(message.createdAt);

  return (
    <div className="border-border bg-background small-desktop:flex hidden flex-col gap-4 overflow-auto border-l p-5">
      <div className="rounded-16 border-border bg-card flex gap-3.5 border p-5">
        <div
          className="flex size-18 shrink-0 -rotate-3 items-center justify-center rounded-full font-serif text-3xl font-bold"
          style={{
            background: message.tint,
            color: "#5a3b20",
          }}
        >
          {message.initials}
        </div>
        <div className="min-w-0 flex-1">
          {message.relation && (
            <Eyebrow className="text-primary">{message.relation}</Eyebrow>
          )}
          <p className="type-h4 mt-1 font-serif leading-snug font-semibold">
            {message.name}
          </p>
          <p className="type-caption text-muted-foreground mt-1">
            {recordedAt} &middot; {fullDuration}
          </p>
        </div>
      </div>

      <div className="rounded-16 bg-foreground text-background relative overflow-hidden p-4.5">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(200px 120px at 80% 50%, oklch(0.705 0.120 262.5 / 0.2), transparent 70%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <button
            type="button"
            className="bg-destructive text-primary-foreground flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-none shadow-[0_0_0_6px_oklch(0.723_0.135_40/0.15)]"
          >
            <Play width={14} height={14} />
          </button>
          <div className="min-w-0 flex-1">
            <Waveform bars={message.wave} height={40} progress={0} />
            <div className="type-caption mt-1.5 flex justify-between font-mono opacity-70">
              <span>0:00</span>
              <span>{fullDuration}</span>
            </div>
          </div>
        </div>
      </div>

      {message.quote && (
        <div className="rounded-8 border-l-3 border-l-[oklch(0.65_0.12_65)] bg-[oklch(0.65_0.12_65/0.1)] px-5 py-4">
          <Eyebrow className="text-[#9A6B2F]">
            {t("messages__detail__pulled_quote")}
          </Eyebrow>
          <p className="type-body-large text-foreground mt-2 font-serif leading-relaxed italic">
            &ldquo;{message.quote}&rdquo;
          </p>
        </div>
      )}

      <div className="rounded-16 border-border bg-card border p-4.5">
        <div className="mb-2 flex items-center justify-between">
          <Eyebrow className="text-muted-foreground">
            {t("messages__detail__transcript_eyebrow")}
          </Eyebrow>
          {detail?.message.transcriptStatus && (
            <span className="type-caption text-muted-foreground capitalize">
              {detail.message.transcriptStatus}
            </span>
          )}
        </div>
        <p className="type-body-small text-foreground leading-relaxed">
          {transcript}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button className="rounded-12">
          {t("messages__detail__add_to_book")}
        </Button>
        <Button variant="outline" className="rounded-12">
          <Download width={14} height={14} /> {t("messages__detail__download")}
        </Button>
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
              message.favorited ? "fill-destructive text-destructive" : ""
            }
          />
          {message.favorited
            ? t("messages__detail__favourited")
            : t("messages__detail__favourite")}
        </Button>
        <Button variant="outline" className="rounded-12">
          {t("messages__detail__reply")}
        </Button>
      </div>

      {message.listens > 0 && (
        <div className="type-caption text-muted-foreground flex items-center gap-2">
          <Play width={10} height={10} />
          <span>
            {t("messages__detail__played_times", { count: message.listens })}
          </span>
          {message.favorited && (
            <>
              <span>&middot;</span>
              <Star
                width={11}
                height={11}
                className="fill-[#9A6B2F] text-[#9A6B2F]"
              />
              <span>{t("messages__detail__book_worthy")}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
