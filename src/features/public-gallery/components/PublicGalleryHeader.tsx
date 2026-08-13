"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlayIcon } from "@ovation/icons/PlayIcon";
import { Button } from "@ovation/ui/components/Button";

type PublicGalleryHeaderProps = {
  count: number;
  eventName: string | null;
  partnerAName: string | null;
  partnerBName: string | null;
  couplePhotoUrl: string | null;
  onStartSlideshow?: () => void;
};

const resolveNames = (
  eventName: string | null,
  a: string | null,
  b: string | null,
): string | null => {
  if (eventName?.trim()) return eventName.trim();
  const names = [a?.trim(), b?.trim()].filter(Boolean);
  return names.length ? names.join(" & ") : null;
};

export const PublicGalleryHeader = ({
  count,
  eventName,
  partnerAName,
  partnerBName,
  couplePhotoUrl,
  onStartSlideshow,
}: PublicGalleryHeaderProps) => {
  const t = useTranslations();
  const [failed, setFailed] = useState(false);
  const names = resolveNames(eventName, partnerAName, partnerBName);
  const showPhoto = couplePhotoUrl && !failed;

  return (
    <div className="rounded-16 from-primary to-primary/70 tablet:h-96 relative h-72 w-full overflow-hidden bg-linear-to-br shadow-lg">
      {showPhoto && (
        <img
          src={couplePhotoUrl}
          alt={names ?? ""}
          onError={() => setFailed(true)}
          className="size-full object-contain"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-8 text-center text-white">
        <p className="type-overline tracking-[2px] uppercase opacity-80">
          {t("guest_gallery__eyebrow")}
        </p>
        <h1 className="type-h1 mt-2 font-semibold tracking-tight">
          {names
            ? t("guest_gallery__title_of", { names })
            : t("guest_gallery__title")}
        </h1>
        <p className="type-body-small mt-2 opacity-90">
          {t("guest_gallery__count", { count })}
        </p>
        {onStartSlideshow && (
          <Button
            type="button"
            onClick={onStartSlideshow}
            className="mt-4 rounded-full"
          >
            <PlayIcon width={16} height={16} />
            {t("guest_gallery__slideshow")}
          </Button>
        )}
      </div>
    </div>
  );
};
