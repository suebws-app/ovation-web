"use client";

import { useState } from "react";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import { CustomizerSection } from "./CustomizerSection";
import { MediaPicker } from "./MediaPicker";
import { CustomizerCheckoutForm } from "./CustomizerCheckoutForm";
import type { Event, KeepsakeProductDetail } from "@/lib/api/types";

type DigitalAlbumCustomizerProps = {
  product: KeepsakeProductDetail;
  eventId: string | null;
  event?: Event | null;
  isPro?: boolean;
};

export const DigitalAlbumCustomizer = ({
  product,
  eventId,
  event,
  isPro = false,
}: DigitalAlbumCustomizerProps) => {
  const [includeAudio, setIncludeAudio] = useState(true);
  const [includeTranscripts, setIncludeTranscripts] = useState(true);
  const [photoIds, setPhotoIds] = useState<string[]>([]);

  const togglePhoto = (id: string) =>
    setPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );

  const customization = { includeAudio, includeTranscripts };

  return (
    <div className="desktop:grid-cols-[1fr_400px] grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        <CustomizerSection
          title="What's inside"
          description="Choose what goes in your downloadable album."
        >
          <div className="flex flex-col gap-3">
            <label className="inline-flex items-center gap-2">
              <Checkbox
                checked={includeAudio}
                onChange={setIncludeAudio}
              />
              <span className="type-body-small">
                Include original audio files (MP3)
              </span>
            </label>
            <label className="inline-flex items-center gap-2">
              <Checkbox
                checked={includeTranscripts}
                onChange={setIncludeTranscripts}
              />
              <span className="type-body-small">
                Include written transcripts (PDF)
              </span>
            </label>
          </div>
        </CustomizerSection>

        <CustomizerSection
          title="Photos"
          description="Pick the photos to feature in the album."
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
        isReady={true}
        requiresShipping={false}
        showEventBadge={isPro}
      />
    </div>
  );
};
