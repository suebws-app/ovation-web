"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { usePublicInfiniteGallery } from "@/lib/query/publicGalleryQueries";
import { PublicGalleryHeader } from "./components/PublicGalleryHeader";
import { PublicGalleryGrid } from "./components/PublicGalleryGrid";
import { PublicGalleryUnavailable } from "./components/PublicGalleryUnavailable";
import { PublicGalleryEmpty } from "./components/PublicGalleryEmpty";
import { PublicGallerySkeleton } from "./components/PublicGallerySkeleton";
import { PublicGalleryLightbox } from "./components/PublicGalleryLightbox";

type PublicGalleryClientProps = {
  slug: string;
  code: string;
  partnerAName: string | null;
  partnerBName: string | null;
  couplePhotoUrl: string | null;
};

export const PublicGalleryClient = ({
  slug,
  code,
  partnerAName,
  partnerBName,
  couplePhotoUrl,
}: PublicGalleryClientProps) => {
  const t = useTranslations();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [slideshow, setSlideshow] = useState(false);

  const startSlideshow = () => {
    setSlideshow(true);
    setLightboxIndex(0);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setSlideshow(false);
  };

  const openLightbox = (i: number) => {
    setSlideshow(false);
    setLightboxIndex(i);
  };

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePublicInfiniteGallery(slug, code);

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) return <PublicGalleryUnavailable />;
  if (isLoading) return <PublicGallerySkeleton />;

  const header = (
    <PublicGalleryHeader
      count={items.length}
      partnerAName={partnerAName}
      partnerBName={partnerBName}
      couplePhotoUrl={couplePhotoUrl}
      onStartSlideshow={items.length > 0 ? startSlideshow : undefined}
    />
  );

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        {header}
        <PublicGalleryEmpty />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {header}
      <PublicGalleryGrid
        items={items}
        slug={slug}
        code={code}
        onOpen={openLightbox}
      />
      <div ref={sentinelRef} className="h-px w-full" aria-hidden />
      {isFetchingNextPage && (
        <p className="type-body-small text-muted-foreground text-center">
          {t("guest_gallery__loading_more")}
        </p>
      )}
      {lightboxIndex !== null && (
        <PublicGalleryLightbox
          items={items}
          index={lightboxIndex}
          slug={slug}
          code={code}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          slideshow={slideshow}
          onClose={closeLightbox}
          onIndexChange={setLightboxIndex}
          onLoadMore={fetchNextPage}
        />
      )}
    </div>
  );
};
