"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { CoverOption } from "./CoverOption";
import {
  COVER_OPTIONS,
  ACCEPT_MIME,
  MAX_BYTES,
} from "@/features/create/constants";

type CoverPhotoSelectorProps = {
  coverType: string;
  coverFile: File | null;
  coverFilePreview: string | null;
  initials: string;
  onSelectPreset: (id: string) => void;
  onSelectFile: (file: File) => void;
};

export const CoverPhotoSelector = ({
  coverType,
  coverFile,
  coverFilePreview,
  initials,
  onSelectPreset,
  onSelectFile,
}: CoverPhotoSelectorProps) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePickFile = () => inputRef.current?.click();

  const handlePreset = (id: string) => {
    if (id === "upload") {
      handlePickFile();
      return;
    }
    onSelectPreset(id);
  };

  return (
    <>
      <div className="tablet:mt-4 tablet:grid-cols-6 tablet:gap-2 mt-3 grid grid-cols-4 gap-2">
        {COVER_OPTIONS.map((option) => (
          <CoverOption
            key={option.id}
            label={option.labelKey && t(option.labelKey)}
            tint={option.tint}
            isUpload={option.isUpload}
            selected={
              option.isUpload ? Boolean(coverFile) : coverType === option.id
            }
            initials={initials}
            onClick={() => handlePreset(option.id)}
          />
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MIME}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (
            file &&
            file.type.startsWith("image/") &&
            file.size <= MAX_BYTES
          ) {
            onSelectFile(file);
          }
          e.target.value = "";
        }}
      />

      {coverFile && (
        <div className="rounded-12 bg-primary/5 mt-3 flex items-center gap-3 p-2.5">
          <div className="size-8 overflow-hidden rounded-md">
            {coverFilePreview && (
              <img
                src={coverFilePreview}
                alt=""
                className="size-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="type-caption text-foreground truncate font-semibold">
              {coverFile.name}
            </p>
            <p className="type-caption text-muted-foreground">
              {t("signup__cover__file_size", {
                size: (coverFile.size / (1024 * 1024)).toFixed(1),
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePickFile}
            className="type-caption text-primary cursor-pointer font-semibold"
          >
            {t("signup__cover__change")}
          </button>
        </div>
      )}
    </>
  );
};
