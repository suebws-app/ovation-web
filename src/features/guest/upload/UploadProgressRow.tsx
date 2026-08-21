"use client";

import { MicIcon } from "@ovation/icons/MicIcon";
import { VideoIcon } from "@ovation/icons/VideoIcon";
import { CameraIcon } from "@ovation/icons/CameraIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { cn } from "@ovation/ui/utils/cn";
import type { UploadItem } from "./useGuestSubmit";

type UploadProgressRowProps = {
  item: UploadItem;
};

const kindIcon = (kind: UploadItem["kind"]) => {
  if (kind === "audio") return <MicIcon width={16} height={16} />;
  if (kind === "video") return <VideoIcon width={16} height={16} />;
  return <CameraIcon width={16} height={16} />;
};

export const UploadProgressRow = ({ item }: UploadProgressRowProps) => (
  <div className="flex items-center gap-3">
    <span className="bg-muted text-muted-foreground rounded-8 flex size-8 shrink-0 items-center justify-center">
      {kindIcon(item.kind)}
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="type-body-small truncate font-medium">
          {item.label}
        </span>
        <span className="type-caption text-muted-foreground shrink-0 tabular-nums">
          {item.status === "done"
            ? "100%"
            : item.status === "failed"
              ? ""
              : `${item.pct}%`}
        </span>
      </div>
      <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-300 ease-out",
            item.status === "failed"
              ? "bg-destructive"
              : item.status === "done"
                ? "bg-success"
                : "bg-primary",
          )}
          style={{
            width:
              item.status === "done" || item.status === "failed"
                ? "100%"
                : `${item.pct}%`,
          }}
        />
      </div>
    </div>
    {item.status === "done" && (
      <span
        className="bg-success/15 text-success flex size-7 shrink-0 items-center justify-center rounded-full"
        aria-hidden
      >
        <CheckIcon width={14} height={14} />
      </span>
    )}
    {item.status === "failed" && (
      <span
        className="bg-destructive/15 text-destructive flex size-7 shrink-0 items-center justify-center rounded-full"
        aria-hidden
      >
        <XIcon width={14} height={14} />
      </span>
    )}
  </div>
);
