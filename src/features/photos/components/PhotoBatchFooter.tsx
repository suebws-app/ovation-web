"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { DownloadIcon } from "@ovation/icons/DownloadIcon";
import { HeartIcon } from "@ovation/icons/HeartIcon";
import { BookIcon } from "@ovation/icons/BookIcon";
import { cn } from "@ovation/ui/utils/cn";

type PhotoBatchFooterProps = {
  count: number;
  allFavorited: boolean;
  allInGoldBook: boolean;
  bulkPending: boolean;
  onBulkFavorite: () => void;
  onBulkGoldBook: () => void;
  onBulkDownload: () => void;
};

export const PhotoBatchFooter = ({
  count,
  allFavorited,
  allInGoldBook,
  bulkPending,
  onBulkFavorite,
  onBulkGoldBook,
  onBulkDownload,
}: PhotoBatchFooterProps) => {
  const t = useTranslations();
  if (count === 0) return null;

  return (
    <div
      className={cn(
        "border-border bg-card shadow-top tablet:flex-row tablet:items-center tablet:gap-3 flex w-full shrink-0 flex-col gap-2 border-t px-4 py-3",
      )}
    >
      <span className="type-body-small font-semibold">
        {t("photos__batch__selected", { count })}
      </span>
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
              ? t("photos__batch__action_unfavourite")
              : t("photos__batch__action_favourite")}
          </span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkGoldBook}
          disabled={bulkPending}
          className="tablet:flex-none min-w-0 flex-1 shrink rounded-full whitespace-nowrap"
        >
          <BookIcon
            width={13}
            height={13}
            className={allInGoldBook ? "fill-yellow-400 text-yellow-500" : ""}
          />
          <span className="truncate">
            {allInGoldBook
              ? t("photos__batch__action_remove_from_gold_book")
              : t("photos__batch__action_add_to_gold_book")}
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
            {t("photos__batch__action_download")}
          </span>
        </Button>
      </div>
    </div>
  );
};
