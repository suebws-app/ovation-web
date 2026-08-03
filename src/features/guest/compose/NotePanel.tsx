"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@ovation/ui/components/Card";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";

const MAX_LENGTH = 200;

export const NotePanel = () => {
  const t = useTranslations();
  const note = useGuestSubmissionStore((s) => s.note);
  const setNote = useGuestSubmissionStore((s) => s.setNote);

  return (
    <Card>
      <CardContent>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, MAX_LENGTH))}
          placeholder={t("guest__record__note__placeholder")}
          rows={5}
          maxLength={MAX_LENGTH}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring tablet:text-sm w-full resize-none rounded-lg border px-3 py-2 font-serif text-base leading-relaxed focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
