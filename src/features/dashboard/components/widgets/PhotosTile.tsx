"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { GalleryItem } from "@/lib/api/types";

type PhotosTileProps = {
  item: GalleryItem;
  overlay?: string;
  onPreview: (item: GalleryItem) => void;
};

export const PhotosTile = ({ item, overlay, onPreview }: PhotosTileProps) => {
  const t = useTranslations();
  const thumb = item.thumbUrl ?? item.url;
  const inner = (
    <>
      {thumb ? (
        <img
          src={thumb}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="bg-secondary size-full" aria-hidden />
      )}
      <div className="bg-foreground/0 group-hover:bg-foreground/15 absolute inset-0 transition-colors" />
      {overlay && (
        <div className="bg-foreground/55 type-body-small text-background absolute inset-0 flex items-center justify-center font-semibold">
          {overlay}
        </div>
      )}
    </>
  );

  if (overlay) {
    return (
      <Link
        href={appRoutes.app.gallery}
        className="rounded-12 bg-muted group relative block aspect-square overflow-hidden"
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onPreview(item)}
      aria-label={t("dashboard__photos__preview")}
      className="rounded-12 bg-muted group relative block aspect-square cursor-pointer overflow-hidden"
    >
      {inner}
    </button>
  );
};
