"use client";

import { useLocale, useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@ovation/ui/components/Avatar";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { TableCell, TableRow } from "@ovation/ui/components/Table";
import { Waveform } from "@ovation/ui/components/Waveform";
import { HeartIcon } from "@ovation/icons/HeartIcon";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";
import { MicIcon } from "@ovation/icons/MicIcon";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import type { MessageSummary } from "@/lib/api/types";
import { formatSec } from "@/lib/utils/formatTime";
import {
  formatDurationShort,
  initialsFrom,
  tintFrom,
  waveFrom,
} from "../adapters";
import { messagesTableColumnClasses } from "../tableColumns";
import { MessagePlayButton } from "./MessagePlayButton";

type MessagesTableRowProps = {
  message: MessageSummary;
  index: number;
  anonymousLabel: string;
  selected: boolean;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  onToggleSelect: () => void;
  onOpen: () => void;
  onPlay: () => void;
};

export const MessagesTableRow = ({
  message,
  index,
  anonymousLabel,
  selected,
  isPlaying,
  progress,
  currentTime,
  onToggleSelect,
  onOpen,
  onPlay,
}: MessagesTableRowProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const displayName = message.guestNames || anonymousLabel;
  const lastDate = new Date(message.createdAt);
  const lastLabel = lastDate.toLocaleString(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const noteText = message.writtenNote?.trim() || message.transcriptSnippet;
  const hasNote = Boolean(message.writtenNote?.trim());
  const duration = formatDurationShort(message.audioDurationSec);
  const wave = waveFrom(message.id);
  const animationDelay = `${Math.min(index, 16) * 30}ms`;

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-row-no-open]")) return;
    onOpen();
  };

  return (
    <TableRow
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={t("messages__row__open_aria", { name: displayName })}
      style={{ animationDelay }}
      className="animate-slide-up-fade cursor-pointer"
    >
      <TableCell
        data-row-no-open
        className={messagesTableColumnClasses.checkbox}
      >
        <Checkbox
          checked={selected}
          onChange={onToggleSelect}
          aria-label={t("messages__row__select_aria", { name: displayName })}
        />
      </TableCell>
      <TableCell className={messagesTableColumnClasses.message}>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="default">
            <AvatarFallback
              className="type-body-small text-primary-foreground font-semibold"
              style={{ background: tintFrom(message.id) }}
            >
              {initialsFrom(message.guestNames)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="type-body-small truncate font-semibold">
                {displayName}
              </span>
              {message.isFavorite && (
                <HeartIcon
                  width={12}
                  height={12}
                  fill="var(--destructive)"
                  stroke="none"
                />
              )}
            </div>
            {noteText && (
              <p className="type-caption text-muted-foreground line-clamp-1 font-serif italic">
                &ldquo;{noteText}&rdquo;
              </p>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2 @[740px]/table:hidden">
              <MediaTypeIcons
                hasAudio={message.hasAudio}
                hasPhoto={message.hasPhoto}
                hasVideo={message.hasVideo}
                hasNote={hasNote}
              />
              <span className="type-caption text-muted-foreground">
                {lastLabel}
              </span>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className={messagesTableColumnClasses.type}>
        <div className="flex items-center gap-2">
          <MediaTypeIcons
            hasAudio={message.hasAudio}
            hasPhoto={message.hasPhoto}
            hasVideo={message.hasVideo}
            hasNote={hasNote}
          />
        </div>
      </TableCell>
      <TableCell
        className={`type-caption text-muted-foreground truncate ${messagesTableColumnClasses.date}`}
      >
        {lastLabel}
      </TableCell>
      <TableCell data-row-no-open className={messagesTableColumnClasses.audio}>
        {message.hasAudio && (
          <div className="flex min-w-0 items-center justify-end gap-3">
            <div className="hidden min-w-0 items-center overflow-hidden @[1420px]/table:flex">
              <Waveform
                bars={wave.slice(0, 24)}
                height={28}
                progress={progress}
              />
            </div>
            <span className="type-caption text-muted-foreground hidden font-mono whitespace-nowrap @[740px]/table:inline">
              {formatSec(isPlaying || progress > 0 ? currentTime : 0)}/
              {duration}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
              aria-label={
                isPlaying
                  ? t("messages__row__pause_aria", { name: displayName })
                  : t("messages__row__play_aria", { name: displayName })
              }
              className="inline-flex"
            >
              <MessagePlayButton playing={isPlaying} />
            </button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

type MediaTypeIconsProps = {
  hasAudio: boolean;
  hasPhoto: boolean;
  hasVideo: boolean;
  hasNote: boolean;
};

const MediaTypeIcons = ({
  hasAudio,
  hasPhoto,
  hasVideo,
  hasNote,
}: MediaTypeIconsProps) => {
  if (!hasAudio && !hasPhoto && !hasVideo && !hasNote) {
    return <span className="type-caption text-muted-foreground">—</span>;
  }
  return (
    <>
      {hasAudio && (
        <MicIcon width={14} height={14} className="text-muted-foreground" />
      )}
      {hasPhoto && (
        <ImageIcon width={14} height={14} className="text-muted-foreground" />
      )}
      {hasVideo && (
        <VideoIcon width={14} height={14} className="text-muted-foreground" />
      )}
      {hasNote && (
        <MessageSquareIcon
          width={14}
          height={14}
          className="text-muted-foreground"
        />
      )}
    </>
  );
};
