"use client";

import { useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useCoverTemplatesQuery } from "@/lib/query/coverTemplatesQueries";
import { useInfiniteGallery } from "@/lib/query/galleryQueries";
import { CoverTemplateTile } from "./CoverTemplateTile";
import { CoverTemplatePreview, pickLayout } from "./CoverTemplatePreview";
import { CoverColorPicker } from "./CoverColorPicker";
import { CoverTextColorControls } from "./CoverTextColorControls";
import { CoverSlotButton } from "./CoverSlotButton";
import { SlotPhotoDialog } from "./SlotPhotoDialog";
import {
  useBookForm,
  type BookFormValues,
  type CoverSlot,
} from "./BookFormContext";
import type { CoverTextElement, Event } from "@/lib/api/types";

type CoverDesignSelectorProps = {
  eventId: string | null;
  event?: Event | null;
};

const coupleNamesOf = (event?: Event | null): string | undefined => {
  const a = event?.partnerAName?.trim();
  const b = event?.partnerBName?.trim();
  if (a && b) return `${a} & ${b}`;
  return a || b || undefined;
};

const formatWeddingDate = (date?: string | null): string | undefined => {
  if (!date) return undefined;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
};

export const CoverDesignSelector = ({
  eventId,
  event,
}: CoverDesignSelectorProps) => {
  const t = useTranslations();
  const { setValue } = useBookForm();
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

  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [pickedThumbs, setPickedThumbs] = useState<Record<string, string>>({});

  const thumbFor = useMemo(() => {
    const map = new Map<string, string>();
    for (const page of gallery.data?.pages ?? []) {
      for (const item of page.items) {
        map.set(item.id, item.thumbUrl ?? item.url ?? "");
      }
    }
    return (mediaId: string) => pickedThumbs[mediaId] ?? map.get(mediaId);
  }, [gallery.data, pickedThumbs]);

  const templates = data?.templates ?? [];
  const selected = templates.find((tpl) => tpl.id === coverTemplateId);
  const slots = useMemo(() => coverSlots ?? [], [coverSlots]);

  const activeLayout = useMemo(
    () => pickLayout(selected?.layouts ?? [], pageAspect),
    [selected, pageAspect],
  );

  const imageSlots = useMemo(
    () => (activeLayout?.elements ?? []).filter((el) => el.type === "image"),
    [activeLayout],
  );

  const textElements = useMemo(
    () =>
      (activeLayout?.elements ?? []).filter(
        (el): el is CoverTextElement => el.type === "text",
      ),
    [activeLayout],
  );

  const templateDefaultHex =
    activeLayout?.pageColor ?? activeLayout?.color ?? "#ffffff";

  const effectiveBg = coverBgColor || templateDefaultHex;
  const textColors = useMemo(() => coverTextColors ?? {}, [coverTextColors]);

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

  const selectTemplate = (id: string) => {
    setValue("coverTemplateId", id, { shouldDirty: true });
    setValue("coverSlots", [], { shouldDirty: true });
  };

  const assignSlot = (mediaId: string, thumbUrl: string) => {
    if (!activeSlotId) return;
    setPickedThumbs((prev) => ({ ...prev, [mediaId]: thumbUrl }));
    const next: CoverSlot[] = [
      ...slots.filter((s) => s.slotId !== activeSlotId),
      { slotId: activeSlotId, mediaId },
    ];
    setValue("coverSlots", next, { shouldDirty: true });
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="type-body-small font-semibold">
          {t("keepsakes__book_customizer__cover_template_title")}
        </h3>
        <p className="type-caption text-muted-foreground mt-0.5 leading-relaxed">
          {t("keepsakes__book_customizer__cover_template_description")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {templates.map((template) => (
          <CoverTemplateTile
            key={template.id}
            template={template}
            selected={template.id === coverTemplateId}
            onSelect={selectTemplate}
            texts={texts}
          />
        ))}
      </div>

      {selected && (
        <div className="flex flex-col gap-2.5">
          <div className="mx-auto w-2/3">
            <CoverTemplatePreview
              template={selected}
              pageAspect={pageAspect}
              texts={texts}
              slotThumbs={slotThumbs}
              coverBgColor={coverBgColor}
              textColorOverrides={textColors}
            />
          </div>

          <CoverColorPicker
            label={t("keepsakes__book_customizer__cover_color_title")}
            description={t(
              "keepsakes__book_customizer__cover_color_description",
            )}
            value={coverBgColor ?? ""}
            defaultHex={templateDefaultHex}
            onChange={(hex) =>
              setValue("coverBgColor", hex, { shouldDirty: true })
            }
            onReset={() => setValue("coverBgColor", "", { shouldDirty: true })}
          />

          <CoverTextColorControls
            textElements={textElements}
            values={textColors}
            effectiveBg={effectiveBg}
          />
          {imageSlots.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {imageSlots.map((slot, index) => (
                <CoverSlotButton
                  key={slot.id}
                  label={t("keepsakes__book_customizer__cover_slot_label", {
                    index: index + 1,
                  })}
                  thumbUrl={slotThumbs[slot.id]}
                  onClick={() => setActiveSlotId(slot.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <SlotPhotoDialog
        eventId={eventId}
        open={activeSlotId !== null}
        onOpenChange={(open) => {
          if (!open) setActiveSlotId(null);
        }}
        onPick={assignSlot}
      />
    </div>
  );
};
