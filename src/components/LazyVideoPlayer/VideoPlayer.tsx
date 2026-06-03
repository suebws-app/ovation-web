"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import {
  MediaPlayer,
  MediaProvider,
  isHTMLVideoElement,
  type MediaLoadedMetadataEvent,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

type VideoMime = "video/mp4" | "video/webm";

type VideoPlayerProps = {
  src: string;
  type: VideoMime;
  load: "visible" | "eager";
  preload: "none" | "metadata";
  className?: string;
};

const ensureDurationKnown = (event: MediaLoadedMetadataEvent) => {
  const el = event.trigger?.target;
  if (!isHTMLVideoElement(el)) return;
  if (Number.isFinite(el.duration) && el.duration > 0) return;
  const onSeeked = () => {
    el.removeEventListener("seeked", onSeeked);
    try {
      el.currentTime = 0;
    } catch {
      /* noop */
    }
  };
  el.addEventListener("seeked", onSeeked);
  try {
    el.currentTime = Number.MAX_SAFE_INTEGER;
  } catch {
    el.removeEventListener("seeked", onSeeked);
  }
};

const handleError = (detail: unknown) => {
  console.error("[video] vidstack error", detail);
};

const VideoPlayer = ({
  src,
  type,
  load,
  preload,
  className,
}: VideoPlayerProps) => (
  <MediaPlayer
    src={[{ src, type }]}
    viewType="video"
    streamType="on-demand"
    load={load}
    preload={preload}
    onLoadedMetadata={ensureDurationKnown}
    onError={handleError}
    className={className}
  >
    <MediaProvider />
    <DefaultVideoLayout icons={defaultLayoutIcons} />
  </MediaPlayer>
);

export default VideoPlayer;
