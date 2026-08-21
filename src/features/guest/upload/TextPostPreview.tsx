"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";

type TextPostPreviewProps = {
  onEdit: () => void;
};

export const TextPostPreview = ({ onEdit }: TextPostPreviewProps) => {
  const t = useTranslations();
  const note = useGuestSubmissionStore((s) => s.note);
  const setNote = useGuestSubmissionStore((s) => s.setNote);

  if (note.trim().length === 0) return null;

  return (
    <div className="bg-card/70 rounded-16 flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="type-body-small text-foreground flex items-center gap-2 font-medium">
          <span className="bg-accent/40 text-foreground flex size-8 items-center justify-center rounded-full">
            <MessageSquareIcon width={16} height={16} aria-hidden />
          </span>
          {t("guest__compose__note_title")}
        </span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            {t("guest__upload__note_edit")}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setNote("")}>
            {t("guest__compose__remove")}
          </Button>
        </div>
      </div>
      <p className="type-body-small text-muted-foreground whitespace-pre-wrap">
        {note}
      </p>
    </div>
  );
};
