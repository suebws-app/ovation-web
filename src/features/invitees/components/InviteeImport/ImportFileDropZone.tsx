"use client";

import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { UploadIcon } from "@ovation/icons/UploadIcon";
import { cn } from "@ovation/ui/utils/cn";
import { ACCEPTED_FILE_TYPES } from "./constants";

type ImportFileDropZoneProps = {
  onFile: (file: File) => void;
};

const FILE_INPUT_ID = "invitee-file";

const isActivationKey = (key: string): boolean =>
  key === "Enter" || key === " ";

export const ImportFileDropZone = ({ onFile }: ImportFileDropZoneProps) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const openFilePicker = () => inputRef.current?.click();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isActivationKey(event.key)) return;
    event.preventDefault();
    openFilePicker();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => setIsDragActive(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        id={FILE_INPUT_ID}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
        }}
        className="hidden"
      />
      <div
        role="button"
        tabIndex={0}
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "rounded-12 focus-visible:ring-primary flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-10 text-center transition-colors focus-visible:ring-2 focus-visible:outline-none",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-primary/3",
        )}
      >
        <div className="bg-primary/10 text-primary rounded-full p-3">
          <UploadIcon className="size-6" />
        </div>
        <p className="type-body-small text-foreground font-semibold">
          {isDragActive
            ? t("invitees__import__file_drop_active")
            : t("invitees__import__file_drop_hint")}
        </p>
        <p className="type-caption text-muted-foreground">
          {t("invitees__import__file_drop_subhint")}
        </p>
      </div>
    </div>
  );
};
