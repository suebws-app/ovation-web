"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Card, CardContent } from "@ovation/ui/components/Card";
import { XIcon } from "@ovation/icons/XIcon";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";

const MAX_LENGTH = 200;

type NotePanelProps = {
  onClose?: () => void;
  autoFocus?: boolean;
};

export const NotePanel = ({ onClose, autoFocus }: NotePanelProps) => {
  const t = useTranslations();
  const note = useGuestSubmissionStore((s) => s.note);
  const setNote = useGuestSubmissionStore((s) => s.setNote);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const el = textareaRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
  }, [autoFocus]);

  return (
    <Card className="relative pt-12">
      {onClose && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 size-8 rounded-full"
          onClick={onClose}
          aria-label={t("common__cancel")}
        >
          <XIcon width={14} height={14} />
        </Button>
      )}
      <CardContent>
        <textarea
          ref={textareaRef}
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, MAX_LENGTH))}
          placeholder={t("guest__record__note__placeholder")}
          rows={5}
          maxLength={MAX_LENGTH}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring tablet:text-sm w-full resize-none rounded-lg border px-3 py-2 text-base leading-relaxed focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="type-caption text-muted-foreground mt-2 flex justify-end">
          {t("guest__record__note__counter", {
            count: note.length,
            max: MAX_LENGTH,
          })}
        </div>
      </CardContent>
    </Card>
  );
};
