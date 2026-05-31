"use client";

import { useState } from "react";
import { Input } from "@ovation/ui/components/Input";
import { Label } from "@ovation/ui/components/Label";
import { CustomizerSection } from "./CustomizerSection";
import { OptionGroup } from "./OptionGroup";
import { AudioMessagePicker } from "./AudioMessagePicker";
import { MediaPicker } from "./MediaPicker";
import { CustomizerCheckoutForm } from "./CustomizerCheckoutForm";
import type { Event, KeepsakeProductDetail } from "@/lib/api/types";

type Style = "cinematic" | "romantic" | "upbeat";

const STYLE_OPTIONS: Array<{ value: Style; label: string; hint: string }> = [
  { value: "cinematic", label: "Cinematic", hint: "Slow pans, warm grade" },
  { value: "romantic", label: "Romantic", hint: "Soft cuts, gentle tempo" },
  { value: "upbeat", label: "Upbeat", hint: "Quick cuts, bright" },
];

type VideoMontageCustomizerProps = {
  product: KeepsakeProductDetail;
  eventId: string | null;
  event?: Event | null;
  isPro?: boolean;
};

export const VideoMontageCustomizer = ({
  product,
  eventId,
  event,
  isPro = false,
}: VideoMontageCustomizerProps) => {
  const [style, setStyle] = useState<Style>("cinematic");
  const [durationSec, setDurationSec] = useState(120);
  const [musicTrackId, setMusicTrackId] = useState("");
  const [messageIds, setMessageIds] = useState<string[]>([]);
  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [videoIds, setVideoIds] = useState<string[]>([]);

  const toggleMessage = (id: string) =>
    setMessageIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  const togglePhoto = (id: string) =>
    setPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  const toggleVideo = (id: string) =>
    setVideoIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );

  const customization = {
    style,
    durationSec,
    musicTrackId: musicTrackId.trim() || undefined,
    messageIds,
    videoIds,
  };

  const isReady =
    messageIds.length > 0 || photoIds.length > 0 || videoIds.length > 0;

  return (
    <div className="desktop:grid-cols-[1fr_400px] grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        <CustomizerSection title="Style" description="The mood of the montage.">
          <OptionGroup
            label="Style"
            value={style}
            options={STYLE_OPTIONS}
            onChange={setStyle}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vm-duration" className="mb-2">
                Length (seconds)
              </Label>
              <Input
                id="vm-duration"
                type="number"
                min={60}
                max={300}
                value={durationSec}
                onChange={(e) =>
                  setDurationSec(
                    Math.max(60, Math.min(300, Number(e.target.value) || 60)),
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="vm-music" className="mb-2">
                Music track ID (optional)
              </Label>
              <Input
                id="vm-music"
                value={musicTrackId}
                onChange={(e) => setMusicTrackId(e.target.value)}
                placeholder="track_warm_strings"
              />
            </div>
          </div>
        </CustomizerSection>

        <CustomizerSection
          title="Audio messages"
          description="Voice clips that play under the montage."
          badge={`${messageIds.length} selected`}
        >
          <AudioMessagePicker
            eventId={eventId}
            selectedIds={messageIds}
            onToggle={toggleMessage}
            onSelectAll={setMessageIds}
            emptyHint="No audio messages yet. Invite guests to record."
          />
        </CustomizerSection>

        <CustomizerSection
          title="Photos"
          description="Photos to mix into the montage."
          badge={`${photoIds.length} selected`}
        >
          <MediaPicker
            eventId={eventId}
            type="photo"
            selectedIds={photoIds}
            onToggle={togglePhoto}
            emptyHint="No photos yet."
          />
        </CustomizerSection>

        <CustomizerSection
          title="Videos"
          description="Video clips to weave into the montage."
          badge={`${videoIds.length} selected`}
        >
          <MediaPicker
            eventId={eventId}
            type="video"
            selectedIds={videoIds}
            onToggle={toggleVideo}
            emptyHint="No videos yet."
          />
        </CustomizerSection>
      </div>

      <CustomizerCheckoutForm
        product={product}
        eventId={eventId}
        event={event}
        customization={customization}
        photoIds={photoIds}
        isReady={isReady}
        notReadyMessage="Pick at least one audio message or media item."
        requiresShipping={false}
        showEventBadge={isPro}
      />
    </div>
  );
};
