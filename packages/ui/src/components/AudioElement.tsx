"use client";

import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
} from "@vidstack/react";
import { forwardRef } from "react";
import { cn } from "../utils/cn";

type AudioElementProps = {
  src: string | null;
  className?: string;
};

export const AudioElement = forwardRef<MediaPlayerInstance, AudioElementProps>(
  ({ src, className }, ref) => (
    <MediaPlayer
      ref={ref}
      src={src ?? ""}
      viewType="audio"
      className={cn("sr-only", className)}
    >
      <MediaProvider />
    </MediaPlayer>
  ),
);

AudioElement.displayName = "AudioElement";
