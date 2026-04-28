"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Book } from "@ovation/icons/Book";
import { Download } from "@ovation/icons/Download";
import { Heart } from "@ovation/icons/Heart";
import { useSidebar } from "@ovation/ui/components/Sidebar";
import { cn } from "@ovation/ui/utils/cn";

type MessageBatchFooterProps = {
  count: number;
  combinedDuration: string;
  onBulkFavorite?: () => void;
  onBulkDownload?: () => void;
  onBulkAddToGoldBook?: () => void;
  bulkPending?: boolean;
  allFavorited?: boolean;
  allInGoldBook?: boolean;
};

export const MessageBatchFooter = ({
  count,
  combinedDuration,
  onBulkFavorite,
  onBulkDownload,
  onBulkAddToGoldBook,
  bulkPending = false,
  allFavorited = false,
  allInGoldBook = false,
}: MessageBatchFooterProps) => {
  const t = useTranslations();
  if (count === 0) return null;

  return (
    <div
      className={cn(
        "border-border bg-card shadow-top fixed right-0 bottom-0 left-0 z-50 flex items-center gap-3 border-t px-4 py-3",
        "desktop:left-(--sidebar-width) small-desktop:right-80",
      )}
    >
      <span className="type-body-small font-semibold">
        {t("messages__batch__selected", { count })}
      </span>
      <span className="type-caption text-muted-foreground">
        {t("messages__batch__combined_duration", {
          duration: combinedDuration,
        })}
      </span>
      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkFavorite}
          disabled={bulkPending}
          className="rounded-full"
        >
          <Heart
            width={13}
            height={13}
            className={allFavorited ? "fill-destructive text-destructive" : ""}
          />
          {allFavorited
            ? t("messages__batch__action_unfavourite")
            : t("messages__batch__action_favourite")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDownload}
          disabled={bulkPending}
          className="rounded-full"
        >
          <Download width={13} height={13} />
          {t("messages__batch__action_download")}
        </Button>
        <Button
          size="sm"
          variant={allInGoldBook ? "secondary" : "default"}
          onClick={onBulkAddToGoldBook}
          disabled={bulkPending}
          className="rounded-full"
        >
          <Book width={13} height={13} />
          {allInGoldBook
            ? t("messages__batch__remove_from_book")
            : t("messages__batch__add_to_book")}
        </Button>
      </div>
    </div>
  );
};
