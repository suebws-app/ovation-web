"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@ovation/ui/components/Avatar";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { TableCell, TableRow } from "@ovation/ui/components/Table";
import { HeartIcon } from "@ovation/icons/HeartIcon";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { MicIcon } from "@ovation/icons/MicIcon";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import type { GuestRow as GuestRowData } from "../adapters";
import { guestsTableColumnClasses } from "../tableColumns";

type GuestRowProps = {
  guest: GuestRowData;
  index: number;
  selected: boolean;
  onToggleSelect: () => void;
};

export const GuestRow = ({
  guest,
  index,
  selected,
  onToggleSelect,
}: GuestRowProps) => {
  const t = useTranslations();

  return (
    <TableRow
      style={{ animationDelay: `${Math.min(index, 16) * 30}ms` }}
      className="animate-slide-up-fade"
    >
      <TableCell className={guestsTableColumnClasses.checkbox}>
        <Checkbox
          checked={selected}
          onChange={onToggleSelect}
          aria-label={t("guests__row__select_aria", { name: guest.name })}
        />
      </TableCell>
      <TableCell className={guestsTableColumnClasses.guest}>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="default">
            <AvatarFallback
              className="type-body-small text-primary-foreground font-semibold"
              style={{ background: guest.tint }}
            >
              {guest.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="type-body-small truncate font-semibold">
                {guest.name}
              </span>
              {guest.isFavorite && (
                <HeartIcon
                  width={12}
                  height={12}
                  fill="var(--destructive)"
                  stroke="none"
                />
              )}
            </div>
            <div className="type-caption text-muted-foreground">
              {t("guests__row__contributions", { count: guest.messageCount })}
            </div>
            <div className="type-caption text-muted-foreground mt-2 flex flex-wrap items-center gap-3 @[740px]/table:hidden">
              <span className="inline-flex items-center gap-1">
                <ImageIcon
                  width={12}
                  height={12}
                  className="text-muted-foreground"
                />
                {guest.photoCount}
              </span>
              <span className="inline-flex items-center gap-1">
                <MicIcon
                  width={12}
                  height={12}
                  className="text-muted-foreground"
                />
                {guest.audioCount}
              </span>
              <span className="inline-flex items-center gap-1">
                <VideoIcon
                  width={12}
                  height={12}
                  className="text-muted-foreground"
                />
                {guest.videoCount}
              </span>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className={guestsTableColumnClasses.messages}>
        <span className="type-body-small font-semibold">
          {guest.messageCount}
        </span>
      </TableCell>
      <TableCell className={guestsTableColumnClasses.photos}>
        <div className="type-body-small text-muted-foreground inline-flex items-center gap-1.5">
          <ImageIcon width={13} height={13} />
          <span className="text-foreground">{guest.photoCount}</span>
        </div>
      </TableCell>
      <TableCell className={guestsTableColumnClasses.audio}>
        <div className="type-body-small text-muted-foreground inline-flex items-center gap-1.5">
          <MicIcon width={13} height={13} />
          <span className="text-foreground">{guest.audioCount}</span>
        </div>
      </TableCell>
      <TableCell className={guestsTableColumnClasses.videos}>
        <div className="type-body-small text-muted-foreground inline-flex items-center gap-1.5">
          <VideoIcon width={13} height={13} />
          <span className="text-foreground">{guest.videoCount}</span>
        </div>
      </TableCell>
      <TableCell className={guestsTableColumnClasses.spacer} />
    </TableRow>
  );
};
