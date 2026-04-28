"use client";

import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
  type MediaPlayerProps,
} from "@vidstack/react";
import { forwardRef } from "react";
import { cn } from "../utils/cn";

type AudioElementProps = {
  src: string | null;
  className?: string;
};

const buildSrc = (src: string | null): MediaPlayerProps["src"] =>
  src ? [{ src, type: "audio/mpeg" }] : "";

export const AudioElement = forwardRef<MediaPlayerInstance, AudioElementProps>(
  ({ src, className }, ref) => (
    <MediaPlayer
      ref={ref}
      src={buildSrc(src)}
      viewType="audio"
      onError={(detail) => {
        console.error("[audio] vidstack error", detail);
      }}
      className={cn("hidden", className)}
    >
      <MediaProvider />
    </MediaPlayer>
  ),
);

AudioElement.displayName = "AudioElement";
