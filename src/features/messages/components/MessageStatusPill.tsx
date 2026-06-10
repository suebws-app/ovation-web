"use client";

import { useTranslations } from "next-intl";
import { HeartIcon } from "@ovation/icons/HeartIcon";
import { BookIcon } from "@ovation/icons/BookIcon";
import { MicIcon } from "@ovation/icons/MicIcon";
import { PillBase } from "@/features/guests/components/PillBase";

type MessageStatusPillProps = {
  favorited: boolean;
  inGoldBook: boolean;
};

export const MessageStatusPill = ({
  favorited,
  inGoldBook,
}: MessageStatusPillProps) => {
  const t = useTranslations();
  if (favorited && inGoldBook) {
    return (
      <PillBase className="bg-secondary/20 text-secondary-foreground">
        <BookIcon width={11} height={11} />
        {t("messages__row__status_gold_book")}
      </PillBase>
    );
  }
  if (inGoldBook) {
    return (
      <PillBase className="bg-secondary/20 text-secondary-foreground">
        <BookIcon width={11} height={11} />
        {t("messages__row__status_gold_book")}
      </PillBase>
    );
  }
  if (favorited) {
    return (
      <PillBase className="bg-primary/15 text-primary">
        <HeartIcon width={11} height={11} />
        {t("messages__row__status_favorited")}
      </PillBase>
    );
  }
  return (
    <PillBase className="bg-muted text-muted-foreground">
      <MicIcon width={11} height={11} />
      {t("messages__row__status_new")}
    </PillBase>
  );
};
