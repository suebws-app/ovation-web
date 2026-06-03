"use client";

import dynamic from "next/dynamic";

const VideoSkeleton = () => (
  <div className="bg-muted size-full animate-pulse rounded-12" />
);

export const LazyVideoPlayer = dynamic(() => import("./VideoPlayer"), {
  ssr: false,
  loading: VideoSkeleton,
});
