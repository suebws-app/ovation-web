"use client";

import { cn } from "@ovation/ui/utils/cn";
import type { PhotoView } from "../adapters";
import { PhotoSelectIndicator } from "./PhotoSelectIndicator";
import { PhotoFavouriteIndicator } from "./PhotoFavouriteIndicator";
import { PhotoAudioBadge } from "./PhotoAudioBadge";

type PhotoTileProps = {
  tile: PhotoView;
  height: number;
  selected?: boolean;
  showSelect?: boolean;
  onClick?: () => void;
};

export const PhotoTile = ({
  tile,
  height,
  selected = false,
  showSelect = false,
  onClick,
}: PhotoTileProps) => {
  const {
    thumbUrl,
    monogram,
    name,
    tint,
    favorited,
    hasAudio,
    audioDuration,
    time,
  } = tile;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group rounded-12 relative mb-3 w-full cursor-pointer overflow-hidden text-left transition-all hover:scale-[1.02] hover:shadow-md",
        selected ? "ring-secondary ring-[3px] ring-offset-1" : "shadow-sm",
      )}
      style={{ breakInside: "avoid" }}
    >
      <div
        className="relative flex w-full items-center justify-center overflow-hidden"
        style={{ height }}
      >
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={name}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(160deg, ${tint}, ${tint}bb)`,
            }}
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,0,0,0.03)_0_8px,transparent_8px_16px)]" />
            <span className="font-serif text-4xl text-black/40">
              {monogram}
            </span>
          </div>
        )}

        {showSelect && <PhotoSelectIndicator selected={selected} />}
        {favorited && <PhotoFavouriteIndicator />}
        {hasAudio && audioDuration && (
          <PhotoAudioBadge duration={audioDuration} />
        )}

        <div className="type-caption absolute right-2 bottom-2 left-2 flex items-baseline justify-between font-semibold text-white drop-shadow-sm">
          <span className="truncate">{name}</span>
          <span className="font-mono opacity-85">{time}</span>
        </div>
      </div>
    </button>
  );
};
