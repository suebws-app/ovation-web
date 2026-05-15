"use client";

import { useState } from "react";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { CustomizerSection } from "./CustomizerSection";
import { VariantSelector } from "./VariantSelector";
import { AudioMessagePicker } from "./AudioMessagePicker";
import { MediaPicker } from "./MediaPicker";
import { CustomizerCheckoutForm } from "./CustomizerCheckoutForm";
import type {
  Event,
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type AudioVinylCustomizerProps = {
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  eventId: string | null;
  event?: Event | null;
  isPro?: boolean;
};

export const AudioVinylCustomizer = ({
  product,
  variants,
  eventId,
  event,
  isPro = false,
}: AudioVinylCustomizerProps) => {
  const [variantId, setVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );
  const [sideALabel, setSideALabel] = useState("");
  const [sideBLabel, setSideBLabel] = useState("");
  const [includedTrackIds, setIncludedTrackIds] = useState<string[]>([]);
  const [photoIds, setPhotoIds] = useState<string[]>([]);

  const selectedVariant = variants.find((v) => v.id === variantId) ?? null;
  const sleeveAttr =
    (selectedVariant?.attributes?.sleeve as string | undefined) ?? null;

  const toggleTrack = (id: string) =>
    setIncludedTrackIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  const togglePhoto = (id: string) =>
    setPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );

  const customization = {
    sleeveDesignId: sleeveAttr,
    sideALabel: sideALabel.trim() || undefined,
    sideBLabel: sideBLabel.trim() || undefined,
    includedTrackIds,
  };

  const isReady = includedTrackIds.length > 0 && !!variantId;

  return (
    <div className="desktop:grid-cols-[1fr_400px] grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        <CustomizerSection
          title="Sleeve"
          description="Cover finish and labels for each side."
        >
          <VariantSelector
            label="Sleeve design"
            variants={variants}
            basePriceCents={product.basePriceCents}
            selectedId={variantId}
            onChange={setVariantId}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="av-side-a" className="mb-2">
                Side A label
              </Label>
              <Input
                id="av-side-a"
                maxLength={40}
                value={sideALabel}
                onChange={(e) => setSideALabel(e.target.value)}
                placeholder="Vows & wishes"
              />
            </div>
            <div>
              <Label htmlFor="av-side-b" className="mb-2">
                Side B label
              </Label>
              <Input
                id="av-side-b"
                maxLength={40}
                value={sideBLabel}
                onChange={(e) => setSideBLabel(e.target.value)}
                placeholder="Toasts & laughter"
              />
            </div>
          </div>
        </CustomizerSection>

        <CustomizerSection
          title="Tracks"
          description="Audio messages pressed to vinyl."
          badge={`${includedTrackIds.length} selected`}
        >
          <AudioMessagePicker
            eventId={eventId}
            selectedIds={includedTrackIds}
            onToggle={toggleTrack}
            onSelectAll={setIncludedTrackIds}
            emptyHint="No audio messages yet. Invite guests to record."
          />
        </CustomizerSection>

        <CustomizerSection
          title="Sleeve photos"
          description="Pick photos to feature on the printed sleeve."
          badge={`${photoIds.length} selected`}
        >
          <MediaPicker
            eventId={eventId}
            type="photo"
            selectedIds={photoIds}
            onToggle={togglePhoto}
            emptyHint="No photos yet. Invite guests to upload."
          />
        </CustomizerSection>
      </div>

      <CustomizerCheckoutForm
        product={product}
        eventId={eventId}
        event={event}
        customization={customization}
        photoIds={photoIds}
        selectedVariant={selectedVariant}
        isReady={isReady}
        notReadyMessage="Pick a sleeve and at least one track."
        showEventBadge={isPro}
      />
    </div>
  );
};
