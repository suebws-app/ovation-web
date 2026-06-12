"use client";

import { useLocale, useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@ovation/ui/components/Avatar";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { TableCell, TableRow } from "@ovation/ui/components/Table";
import { HeartIcon } from "@ovation/icons/HeartIcon";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { MicIcon } from "@ovation/icons/MicIcon";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import type { GuestRow as GuestRowData } from "../adapters";
import { guestsTableColumnClasses } from "../tableColumns";
import { GuestStatusPill } from "./GuestStatusPill";

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
  const locale = useLocale();
  const lastDate = new Date(guest.lastAt);
  const lastLabel = lastDate.toLocaleString(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

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
            <div className="mt-2 flex flex-wrap items-center gap-2 @[740px]/table:hidden">
              <GuestStatusPill
                contributed={guest.messageCount > 0}
                thanked={false}
              />
              <span className="type-caption text-muted-foreground">
                {lastLabel}
              </span>
              {guest.audioCount > 0 && (
                <MicIcon
                  width={12}
                  height={12}
                  className="text-muted-foreground"
                />
              )}
              {guest.photoCount > 0 && (
                <ImageIcon
                  width={12}
                  height={12}
                  className="text-muted-foreground"
                />
              )}
              {guest.videoCount > 0 && (
                <VideoIcon
                  width={12}
                  height={12}
                  className="text-muted-foreground"
                />
              )}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className={guestsTableColumnClasses.messages}>
        <div className="type-caption text-muted-foreground flex items-center gap-2">
          <span className="text-foreground font-semibold">
            {guest.messageCount}
          </span>
          {guest.audioCount > 0 && (
            <MicIcon width={12} height={12} className="text-muted-foreground" />
          )}
          {guest.photoCount > 0 && (
            <ImageIcon
              width={12}
              height={12}
              className="text-muted-foreground"
            />
          )}
          {guest.videoCount > 0 && (
            <VideoIcon
              width={12}
              height={12}
              className="text-muted-foreground"
            />
          )}
        </div>
      </TableCell>
      <TableCell className={guestsTableColumnClasses.status}>
        <GuestStatusPill contributed={guest.messageCount > 0} thanked={false} />
      </TableCell>
      <TableCell
        className={`type-caption text-muted-foreground truncate ${guestsTableColumnClasses.lastSeen}`}
      >
        {lastLabel}
      </TableCell>
      <TableCell className={guestsTableColumnClasses.spacer} />
    </TableRow>
  );
};
