"use client";

import { useEffect, useRef } from "react";

type InfiniteScrollSentinelProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  loadingLabel?: string;
};

export const InfiniteScrollSentinel = ({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  loadingLabel,
}: InfiniteScrollSentinelProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (!hasNextPage && !isFetchingNextPage) return null;

  return (
    <div className="flex flex-col">
      <div ref={ref} aria-hidden className="h-px" />
      {isFetchingNextPage && (
        <div
          role="status"
          aria-live="polite"
          className="border-border flex items-center justify-center gap-2 border-t px-6 py-4"
        >
          <span
            aria-hidden
            className="border-muted-foreground/30 border-t-primary inline-block size-3.5 animate-spin rounded-full border-2"
          />
          {loadingLabel && (
            <span className="type-caption text-muted-foreground">
              {loadingLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
