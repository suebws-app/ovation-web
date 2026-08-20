"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { GuestActionSheet } from "./GuestActionSheet";

const MAX_LENGTH = 200;

type TextPostSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const TextPostSheet = ({ open, onOpenChange }: TextPostSheetProps) => {
  const t = useTranslations();
  const note = useGuestSubmissionStore((s) => s.note);
  const setNote = useGuestSubmissionStore((s) => s.setNote);

  return (
    <GuestActionSheet
      open={open}
      title={t("guest__compose__note_title")}
      onOpenChange={onOpenChange}
    >
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value.slice(0, MAX_LENGTH))}
        placeholder={t("guest__record__note__placeholder")}
        rows={6}
        maxLength={MAX_LENGTH}
        autoFocus
        className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring type-body w-full flex-1 resize-none rounded-lg border px-3 py-2 leading-relaxed focus-visible:ring-2 focus-visible:outline-none"
      />
      <div className="type-caption text-muted-foreground flex justify-end">
        {t("guest__record__note__counter", {
          count: note.length,
          max: MAX_LENGTH,
        })}
      </div>

      <Button onClick={() => onOpenChange(false)} className="w-full">
        {t("guest__upload__note_done")}
      </Button>
    </GuestActionSheet>
  );
};
