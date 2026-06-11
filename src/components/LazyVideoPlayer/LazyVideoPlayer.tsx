"use client";

import dynamic from "next/dynamic";

const VideoSkeleton = () => (
  <div className="bg-muted rounded-12 size-full animate-pulse" />
);

export const LazyVideoPlayer = dynamic(() => import("./VideoPlayer"), {
  ssr: false,
  loading: VideoSkeleton,
});
