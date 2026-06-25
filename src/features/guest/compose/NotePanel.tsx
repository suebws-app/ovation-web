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
          className="border-border bg-background type-body rounded-12 focus:border-primary focus:ring-primary/20 w-full resize-none border p-4 font-serif leading-relaxed outline-none focus:ring-2"
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
