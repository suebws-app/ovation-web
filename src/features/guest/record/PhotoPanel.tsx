"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { ImageIcon } from "@ovation/icons/ImageIcon";

const MAX_BYTES = 25 * 1024 * 1024;

export type PhotoSelection = {
  file: File;
  url: string;
  width: number;
  height: number;
};

type PhotoPanelProps = {
  photo: PhotoSelection | null;
  onChange: (photo: PhotoSelection | null) => void;
};

export const PhotoPanel = ({ photo, onChange }: PhotoPanelProps) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (photo?.url) URL.revokeObjectURL(photo.url);
    };
  }, [photo?.url]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(t("guest__record__photo__error_not_image"));
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(t("guest__record__photo__error_too_large"));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      onChange({
        file,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setError(null);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError(t("guest__record__photo__error_open"));
    };
    img.src = url;
  };

  if (photo) {
    return (
      <div className="rounded-16 bg-card border-border space-y-4 border p-6">
        <img
          src={photo.url}
          alt=""
          className="rounded-12 max-h-105 w-full object-contain"
        />
        <p className="type-caption text-muted-foreground">
          {t("guest__record__photo__dimensions", {
            width: photo.width,
            height: photo.height,
            size: (photo.file.size / (1024 * 1024)).toFixed(1),
          })}
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => onChange(null)}
          >
            {t("guest__record__photo__choose_another")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-16 bg-card border-border flex flex-col items-center gap-5 border p-10 text-center">
      <ImageIcon width={28} height={28} className="text-primary" />
      <p className="type-body-small text-muted-foreground max-w-sm">
        {t("guest__record__photo__caption")}
      </p>
      <Button
        type="button"
        size="lg"
        className="rounded-full"
        onClick={() => inputRef.current?.click()}
      >
        <ImageIcon width={16} height={16} />
        {t("guest__record__photo__choose")}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && (
        <p className="type-body-small text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
