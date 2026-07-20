"use client";

import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useCoverTemplatesQuery } from "@/lib/query/coverTemplatesQueries";
import { useInfiniteGallery } from "@/lib/query/galleryQueries";
import { CoverTemplatePreview } from "./CoverTemplatePreview";
import { coupleNamesOf, formatWeddingDate } from "./coverTextValues";
import type { BookFormValues } from "./BookFormContext";
import type { Event } from "@/lib/api/types";

type CoverPreviewCardProps = {
  eventId: string | null;
  event?: Event | null;
};

export const CoverPreviewCard = ({ eventId, event }: CoverPreviewCardProps) => {
  const { data } = useCoverTemplatesQuery();
  const gallery = useInfiniteGallery(eventId ?? "", {
    type: "photo",
    includeOwnerUploads: true,
  });

  const [
    coverTemplateId,
    coverSlots,
    coverText,
    sizeKey,
    coverBgColor,
    coverTextColors,
  ] = useWatch<
    BookFormValues,
    [
      "coverTemplateId",
      "coverSlots",
      "coverText",
      "sizeKey",
      "coverBgColor",
      "coverTextColors",
    ]
  >({
    name: [
      "coverTemplateId",
      "coverSlots",
      "coverText",
      "sizeKey",
      "coverBgColor",
      "coverTextColors",
    ],
  });

  const pageAspect = useMemo(() => {
    const match = /^(\d+)x(\d+)$/.exec(sizeKey ?? "");
    if (!match) return undefined;
    const w = Number(match[1]);
    const h = Number(match[2]);
    return w > 0 && h > 0 ? w / h : undefined;
  }, [sizeKey]);

  const thumbFor = useMemo(() => {
    const map = new Map<string, string>();
    for (const page of gallery.data?.pages ?? []) {
      for (const item of page.items) {
        map.set(item.id, item.thumbUrl ?? item.url ?? "");
      }
    }
    return (mediaId: string) => map.get(mediaId);
  }, [gallery.data]);

  const templates = data?.templates ?? [];
  const selected = templates.find((tpl) => tpl.id === coverTemplateId);
  const slots = useMemo(() => coverSlots ?? [], [coverSlots]);

  const slotThumbs = useMemo(() => {
    const out: Record<string, string | undefined> = {};
    for (const slot of slots) {
      const thumb = thumbFor(slot.mediaId);
      if (thumb) out[slot.slotId] = thumb;
    }
    return out;
  }, [slots, thumbFor]);

  const texts = useMemo(
    () => ({
      coverTitle: coverText || undefined,
      coupleNames: coupleNamesOf(event),
      weddingDate: formatWeddingDate(event?.weddingDate),
    }),
    [coverText, event],
  );

  if (!selected) return null;

  return (
    <div className="border-border rounded-16 border p-3">
      <div className="mx-auto w-2/3">
        <CoverTemplatePreview
          template={selected}
          pageAspect={pageAspect}
          texts={texts}
          slotThumbs={slotThumbs}
          coverBgColor={coverBgColor}
          textColorOverrides={coverTextColors ?? {}}
        />
      </div>
    </div>
  );
};
