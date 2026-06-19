"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ImageIcon } from "@ovation/icons/ImageIcon";

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

const COLS_CLASS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
};

const TILE_MIN_PX = 110;
const GAP_PX = 8;
const PADDING_PX = 40;
const ROWS = 2;
const MIN_COLS = 3;
const MAX_COLS = 7;

export const Photos = ({ photos, totalCount, hasMore }: PhotosProps) => {
  const t = useTranslations();
  const [preview, setPreview] = useState<GalleryItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(MIN_COLS);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = (width: number) => {
      const available = Math.max(0, width - PADDING_PX + GAP_PX);
      const fit = Math.floor(available / (TILE_MIN_PX + GAP_PX));
      const next = Math.max(MIN_COLS, Math.min(MAX_COLS, fit));
      setCols(next);
    };
    compute(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      compute(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const tileCount = cols * ROWS;
  const tiles = photos
    .filter((p) => Boolean(p.thumbUrl ?? p.url))
    .slice(0, tileCount);
  const remaining = Math.max(0, totalCount - tiles.length);
  const showOverlay =
    tiles.length === tileCount && (remaining > 0 || Boolean(hasMore));
  const overlayCount = remaining > 0 ? remaining : totalCount - tiles.length;

  return (
    <div
      ref={containerRef}
      className="rounded-20 border-border bg-card flex min-h-62 w-full min-w-0 flex-col gap-4 border p-5 shadow-sm min-[1300px]:h-full min-[1300px]:flex-1"
    >
      {tiles.length > 0 && (
        <div className={`grid gap-2 ${COLS_CLASS[cols]}`}>
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
        href={appRoutes.app.gallery}
        className="type-body-small text-chart-2 inline-flex items-center justify-center gap-1.5 font-semibold hover:underline"
      >
        {t("dashboard__widget__photos__open_gallery")}
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
