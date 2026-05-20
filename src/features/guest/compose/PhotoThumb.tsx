"use client";

import { XIcon } from "@ovation/icons/XIcon";
import type { PhotoCapture } from "../store/useGuestSubmissionStore";

type PhotoThumbProps = {
  photo: PhotoCapture;
  onRemove: () => void;
  removeLabel: string;
};

export const PhotoThumb = ({
  photo,
  onRemove,
  removeLabel,
}: PhotoThumbProps) => (
  <div className="rounded-12 border-border bg-background relative aspect-square overflow-hidden border">
    <img src={photo.url} alt="" className="size-full object-cover" />
    <button
      type="button"
      onClick={onRemove}
      aria-label={removeLabel}
      className="bg-foreground/70 text-background hover:bg-foreground absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full backdrop-blur-sm transition"
    >
      <XIcon width={12} height={12} />
    </button>
  </div>
);
