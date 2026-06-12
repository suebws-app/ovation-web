"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { MessageSquareIcon } from "@ovation/icons/MessageSquareIcon";
import { useGuestSubmissionStore } from "../store/useGuestSubmissionStore";
import { CaptureCardHeader } from "./CaptureCardHeader";
import { NotePanel } from "./NotePanel";

const noteToneColor = "oklch(0.45 0.08 145)";

const tonalButtonClass =
  "bg-secondary/30 hover:bg-secondary/50 rounded-12 tablet:w-auto tablet:px-5 h-12 w-full gap-2";

export const NoteCaptureCard = () => {
  const t = useTranslations();
  const note = useGuestSubmissionStore((s) => s.note);
  const setNote = useGuestSubmissionStore((s) => s.setNote);
  const filled = note.trim().length > 0;
  const [editing, setEditing] = useState(false);

  const open = editing || filled;

  return (
    <div className="bg-card/70 rounded-16 tablet:p-5 p-4">
      <div className="tablet:flex-row tablet:items-center flex flex-col gap-4">
        <CaptureCardHeader
          icon={<MessageSquareIcon width={20} height={20} />}
          iconClassName="bg-secondary/30"
          iconStyle={{ color: noteToneColor }}
          title={t("guest__compose__note_title")}
          meta={
            filled
              ? t("guest__compose__note_captured", { count: note.length })
              : t("guest__compose__note_subtitle")
          }
        />
        {!open && (
          <Button
            type="button"
            variant="ghost"
            className={tonalButtonClass}
            style={{ color: noteToneColor }}
            onClick={() => setEditing(true)}
          >
            <MessageSquareIcon width={16} height={16} />
            {t("guest__compose__add_note")}
          </Button>
        )}
      </div>

      {open && (
        <div className="mt-4">
          <NotePanel />
        </div>
      )}

      {open && filled && (
        <div className="mt-3 flex justify-end gap-2">
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              setNote("");
              setEditing(false);
            }}
          >
            {t("guest__compose__remove")}
          </Button>
        </div>
      )}
    </div>
  );
};
