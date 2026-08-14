"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { Label } from "@ovation/ui/components/Label";
import { eventsClient } from "@/lib/api/events-client";
import { uploadToTarget } from "@/lib/media/uploadToTarget";

const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,application/pdf";
const MAX_BYTES = 25 * 1024 * 1024;

type DetailAssetUploadProps = {
  eventId: string;
  field: string;
  label: string;
  kind: "image" | "file";
  value: string | undefined;
  onChange: (url: string) => void;
};

/**
 * Upload button for an event detail asset (e.g. corporate logo, agenda PDF).
 * Presigns via the event-scoped asset endpoint, PUTs the file, and returns the
 * public URL. Only usable after the event exists (Settings), which is the only
 * point an authenticated, event-scoped upload is possible.
 */
export const DetailAssetUpload = ({
  eventId,
  field,
  label,
  kind,
  value,
  onChange,
}: DetailAssetUploadProps) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");

  const handleFile = async (file: File) => {
    if (file.size > MAX_BYTES) {
      setStatus("error");
      return;
    }
    setStatus("uploading");
    try {
      const result = await eventsClient.assetUploadUrl(
        eventId,
        field,
        file.type,
      );
      await uploadToTarget({ url: result.uploadUrl, key: result.key }, file);
      onChange(result.publicUrl);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  const showImagePreview = kind === "image" && Boolean(value);

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        {showImagePreview ? (
          <img
            src={value}
            alt={label}
            className="border-border rounded-8 size-14 border object-contain"
          />
        ) : value ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-primary type-body-small underline"
          >
            {t("settings__event_details__view_file")}
          </a>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
        >
          {status === "uploading"
            ? t("settings__event_details__uploading")
            : value
              ? t("settings__event_details__replace")
              : t("settings__event_details__upload")}
        </Button>
        {value && status !== "uploading" && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => onChange("")}
            className="text-muted-foreground hover:text-destructive"
          >
            {t("settings__event_details__remove")}
          </Button>
        )}
      </div>
      {status === "error" && (
        <span className="type-caption text-destructive">
          {t("settings__event_details__upload_error")}
        </span>
      )}
    </div>
  );
};
