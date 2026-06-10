"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { BookIcon } from "@ovation/icons/BookIcon";
import { DownloadIcon } from "@ovation/icons/DownloadIcon";
import { HeartIcon } from "@ovation/icons/HeartIcon";
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
        "border-border bg-card shadow-top tablet:flex-row tablet:items-center tablet:gap-3 flex w-full shrink-0 flex-col gap-2 border-t px-4 py-3",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
        <span className="type-body-small font-semibold">
          {t("messages__batch__selected", { count })}
        </span>
        <span className="type-caption text-muted-foreground">
          {t("messages__batch__combined_duration", {
            duration: combinedDuration,
          })}
        </span>
      </div>
      <div className="tablet:ml-auto tablet:flex-nowrap flex flex-wrap items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkFavorite}
          disabled={bulkPending}
          className="tablet:flex-none min-w-0 flex-1 shrink rounded-full whitespace-nowrap"
        >
          <HeartIcon
            width={13}
            height={13}
            className={allFavorited ? "fill-destructive text-destructive" : ""}
          />
          <span className="truncate">
            {allFavorited
              ? t("messages__batch__action_unfavourite")
              : t("messages__batch__action_favourite")}
          </span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDownload}
          disabled={bulkPending}
          className="tablet:flex-none min-w-0 flex-1 shrink rounded-full whitespace-nowrap"
        >
          <DownloadIcon width={13} height={13} />
          <span className="truncate">
            {t("messages__batch__action_download")}
          </span>
        </Button>
        <Button
          size="sm"
          variant={allInGoldBook ? "secondary" : "default"}
          onClick={onBulkAddToGoldBook}
          disabled={bulkPending}
          className="tablet:flex-none min-w-0 flex-1 shrink rounded-full whitespace-nowrap"
        >
          <BookIcon width={13} height={13} />
          <span className="truncate">
            {allInGoldBook
              ? t("messages__batch__remove_from_book")
              : t("messages__batch__add_to_book")}
          </span>
        </Button>
      </div>
    </div>
  );
};
