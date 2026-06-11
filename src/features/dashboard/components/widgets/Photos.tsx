"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import type { GalleryItem } from "@/lib/api/types";
import { MediaPreviewDialog } from "@/features/keepsakes/customizer/MediaPreviewDialog";
import { PhotosTile } from "./PhotosTile";

type PhotosProps = {
  photos: GalleryItem[];
  totalCount: number;
  hasMore?: boolean;
};

const TILE_COUNT = 6;

export const Photos = ({ photos, totalCount, hasMore }: PhotosProps) => {
  const t = useTranslations();
  const [preview, setPreview] = useState<GalleryItem | null>(null);

  const tiles = photos
    .filter((p) => Boolean(p.thumbUrl ?? p.url))
    .slice(0, TILE_COUNT);
  const remaining = Math.max(0, totalCount - tiles.length);
  const showOverlay =
    tiles.length === TILE_COUNT && (remaining > 0 || Boolean(hasMore));
  const overlayCount = remaining > 0 ? remaining : totalCount - tiles.length;

  return (
    <div className="rounded-20 border-border bg-card flex min-h-62 w-full flex-col gap-4 border p-5 shadow-sm min-[1300px]:w-80 min-[1300px]:shrink-0">
      {tiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {tiles.map((item, index) => (
            <PhotosTile
              key={item.id}
              item={item}
              onPreview={setPreview}
              overlay={
                index === tiles.length - 1 && showOverlay
                  ? t("dashboard__widget__photos__more", {
                      count: Math.max(1, overlayCount),
                    })
                  : undefined
              }
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-chart-2/20 text-chart-2 rounded-12 inline-flex size-10 items-center justify-center">
            <ImageIcon width={18} height={18} />
          </span>
          <div>
            <p className="type-body font-serif font-semibold">
              {totalCount}
              <span className="type-body text-muted-foreground ml-1.5 font-sans font-normal">
                {t("dashboard__widget__photos__unit")}
              </span>
            </p>
            <p className="type-caption text-muted-foreground">
              {t("dashboard__widget__photos__subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-border h-px w-full" aria-hidden />

      <Link
        href={appRoutes.app.photos}
        className="type-body-small text-chart-2 inline-flex items-center justify-center gap-1.5 font-semibold hover:underline"
      >
        {t("dashboard__widget__photos__open_gallery")}
        <ArrowRightIcon width={12} height={12} />
      </Link>

      <MediaPreviewDialog
        item={preview}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
      />
    </div>
  );
};
