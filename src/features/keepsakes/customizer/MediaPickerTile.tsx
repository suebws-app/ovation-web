"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { MaximizeIcon } from "@ovation/icons/MaximizeIcon";
import type { GalleryItem } from "@/lib/api/types";

type MediaPickerTileProps = {
  item: GalleryItem;
  index?: number;
  selected: boolean;
  selectionOrder: number | null;
  onToggle: (id: string) => void;
  onPreview: (item: GalleryItem) => void;
};

const TILE_SIZES =
  "(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw";

export const MediaPickerTile = ({
  item,
  index = 0,
  selected,
  selectionOrder,
  onToggle,
  onPreview,
}: MediaPickerTileProps) => {
  const t = useTranslations();
  const thumb = item.thumbUrl ?? item.url;
  return (
    <div
      style={{ animationDelay: `${Math.min(index, 12) * 25}ms` }}
      className={`rounded-12 bg-muted animate-slide-up-fade relative aspect-square overflow-hidden border-2 transition-[border-color,transform] duration-200 ${
        selected ? "border-primary scale-[0.97]" : "border-transparent"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        aria-label={selected ? t("common__deselect") : t("common__select")}
        className="absolute inset-0 h-full w-full cursor-default"
      >
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            fill
            sizes={TILE_SIZES}
            className="pointer-events-none object-cover select-none"
            loading="lazy"
            unoptimized
            draggable={false}
          />
        ) : null}
      </button>
      {item.type === "video" && (
        <span className="type-caption bg-foreground/70 text-background rounded-8 pointer-events-none absolute bottom-1.5 left-1.5 px-1.5 py-0.5">
          {t("common__video")}
        </span>
      )}
      {selected && (
        <span className="bg-primary text-primary-foreground type-caption pointer-events-none absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full font-bold">
          {selectionOrder !== null ? (
            selectionOrder
          ) : (
            <CheckIcon width={14} height={14} />
          )}
        </span>
      )}
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onPreview(item);
        }}
        aria-label={t("common__preview")}
        className="bg-foreground/70 text-background hover:bg-foreground absolute right-1.5 bottom-1.5 flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors"
      >
        <MaximizeIcon width={14} height={14} />
      </button>
    </div>
  );
};
