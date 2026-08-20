"use client";

import { useRef } from "react";
import { Button } from "@ovation/ui/components/Button";
import { cn } from "@ovation/ui/utils/cn";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { ACCEPT_MIME } from "@/features/create/constants";
import {
  useEventPhotoUpload,
  type EventPhotoField,
} from "../useEventPhotoUpload";

export type LinkPhotoCardLabels = {
  eyebrow: string;
  title: string;
  description: string;
  hint: string;
  upload: string;
  change: string;
  remove: string;
  uploading: string;
  removing: string;
  saved: string;
  uploadError: string;
};

type LinkPhotoCardProps = {
  eventId: string;
  field: EventPhotoField;
  initialUrl: string | null;
  labels: LinkPhotoCardLabels;
  circular?: boolean;
};

export const LinkPhotoCard = ({
  eventId,
  field,
  initialUrl,
  labels,
  circular,
}: LinkPhotoCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { displayUrl, photoUrl, status, busy, upload, remove } =
    useEventPhotoUpload({
      eventId,
      field,
      initialUrl,
      errorMessage: labels.uploadError,
    });

  return (
    <div className="rounded-16 border-border bg-card tablet:p-6 flex flex-col gap-5 border p-5">
      <div>
        <p className="type-overline text-muted-foreground tracking-[2px]">
          {labels.eyebrow}
        </p>
        <p className="tablet:type-h2 type-h3 mt-1.5 leading-snug font-semibold tracking-tight">
          {labels.title}
        </p>
        <p className="type-body-small text-muted-foreground mt-1.5">
          {labels.description}
        </p>
      </div>

      <div className="tablet:flex-row tablet:items-center flex flex-col gap-5">
        <div
          className={cn(
            "border-border bg-muted/50 relative flex size-28 shrink-0 items-center justify-center overflow-hidden border",
            circular ? "rounded-full" : "rounded-16",
          )}
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <ImageIcon
              width={28}
              height={28}
              className="text-muted-foreground"
            />
          )}
          {status.kind === "uploading" && (
            <div className="bg-foreground/30 absolute inset-0 flex items-center justify-center">
              <span className="border-primary-foreground size-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="type-caption text-muted-foreground">{labels.hint}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              {status.kind === "uploading"
                ? labels.uploading
                : photoUrl
                  ? labels.change
                  : labels.upload}
            </Button>
            {photoUrl && (
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={() => void remove()}
                disabled={busy}
              >
                {status.kind === "removing" ? labels.removing : labels.remove}
              </Button>
            )}
          </div>

          {status.kind === "error" && (
            <p className="type-caption text-destructive mt-2" role="alert">
              {status.message}
            </p>
          )}
          {status.kind === "saved" && (
            <p className="type-caption text-secondary mt-2">{labels.saved}</p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MIME}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
};
