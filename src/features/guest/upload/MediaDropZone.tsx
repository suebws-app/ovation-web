"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { PlusIcon } from "@ovation/icons/PlusIcon";

type MediaDropZoneProps = {
  onFiles: (files: FileList | null) => void;
  isProcessing: boolean;
};

export const MediaDropZone = ({
  onFiles,
  isProcessing,
}: MediaDropZoneProps) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isProcessing}
        className="border-primary/60 rounded-24 hover:bg-primary/5 flex w-full cursor-pointer flex-col items-center gap-3 border-2 border-dashed px-6 py-12 transition-colors disabled:cursor-wait"
      >
        <span className="bg-primary/15 text-primary flex size-14 items-center justify-center rounded-full">
          <PlusIcon className="size-6" aria-hidden />
        </span>
        <span className="type-h3 text-foreground font-semibold">
          {isProcessing
            ? t("guest__upload__processing")
            : t("guest__upload__pick_title")}
        </span>
        <span className="type-body-small text-muted-foreground">
          {t("guest__upload__pick_subtitle")}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(event) => {
          onFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </>
  );
};
