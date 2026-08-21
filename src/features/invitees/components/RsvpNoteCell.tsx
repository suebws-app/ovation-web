"use client";

import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";
import type { Invitee } from "@/lib/api/types";

type RsvpNoteCellProps = {
  invitee: Invitee;
};

export const RsvpNoteCell = ({ invitee }: RsvpNoteCellProps) => {
  const t = useTranslations();
  const note = invitee.rsvpNote?.trim();
  if (!note) {
    return <span className="type-body-small text-muted-foreground">—</span>;
  }
  return (
    <Popover>
      <PopoverTrigger
        aria-label={t("invitees__table__col_note")}
        className="text-muted-foreground hover:text-primary hover:bg-muted data-[state=open]:text-primary data-[state=open]:bg-muted rounded-8 inline-flex size-8 cursor-pointer items-center justify-center transition-colors"
      >
        <MessageSquareIcon className="size-4" />
      </PopoverTrigger>
      <PopoverContent className="max-w-xs">
        <p className="type-body-small text-foreground break-words whitespace-pre-wrap">
          {note}
        </p>
      </PopoverContent>
    </Popover>
  );
};
