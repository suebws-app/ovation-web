"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { SelectionToolbar } from "@/components/SelectionToolbar";
import { useSelectionMode } from "@/lib/hooks/useSelectionMode";
import { useMessagesList, useUpdateMessage } from "@/lib/query/messagesQueries";

import { BatchBar } from "./components/BatchBar";
import { DetailPane } from "./components/DetailPane";
import { PhotoGallery } from "./components/PhotoGallery";
import { PhotoToolbar } from "./components/PhotoToolbar";
import { toPhotoView } from "./adapters";

type PhotosPageClientProps = {
  eventId: string;
};

export const PhotosPageClient = ({ eventId }: PhotosPageClientProps) => {
  const t = useTranslations();
  const selection = useSelectionMode<string>();
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);

  const query = {
    filter: "with_photo" as const,
    sort: "newest" as const,
    limit: 60,
  };
  const { data, isPending, isError } = useMessagesList(eventId, query);
  const updateMessage = useUpdateMessage(eventId);

  const anonymous = t("common__anonymous");
  const photos = useMemo(
    () => (data?.items ?? []).map((m) => toPhotoView(m, anonymous)),
    [data?.items, anonymous],
  );

  const activePhoto =
    photos.find((p) => p.id === activePhotoId) ?? photos[0] ?? null;

  const handleTileClick = (id: string) => {
    if (selection.selectMode) {
      selection.toggleSelect(id);
    } else {
      setActivePhotoId(id);
    }
  };

  const handleToggleFavorite = () => {
    if (!activePhoto) return;
    updateMessage.mutate({
      messageId: activePhoto.id,
      input: { isFavorite: !activePhoto.favorited },
    });
  };

  return (
    <div className="tablet:-mb-10 desktop:-mb-20 large-desktop:grid-cols-[1fr_340px] -mx-4 -mb-6 grid min-h-screen">
      <div className="bg-card flex min-w-0 flex-col">
        <PhotoToolbar />
        <SelectionToolbar
          selectMode={selection.selectMode}
          count={selection.selectedIds.size}
          onToggle={selection.toggleSelectMode}
          onClearAll={selection.clear}
        />
        {selection.selectMode && (
          <BatchBar count={selection.selectedIds.size} total={photos.length} />
        )}
        {isPending ? (
          <p className="type-body-small text-muted-foreground p-8 text-center">
            {t("photos__loading")}
          </p>
        ) : isError ? (
          <p className="type-body-small text-destructive p-8 text-center">
            {t("photos__error")}
          </p>
        ) : (
          <PhotoGallery
            photos={photos}
            selectMode={selection.selectMode}
            selectedIds={selection.selectedIds}
            onTileClick={handleTileClick}
          />
        )}
      </div>
      <DetailPane
        eventId={eventId}
        photo={activePhoto}
        onToggleFavorite={handleToggleFavorite}
        togglePending={updateMessage.isPending}
      />
    </div>
  );
};
