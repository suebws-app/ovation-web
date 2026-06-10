"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import {
  FilterChipRail,
  type FilterChipItem,
} from "@/components/FilterChipRail";
import type { EventStats } from "@/lib/api/types";
import {
  usePhotoSelectedIds,
  usePhotosStore,
  useSubFilter,
  type PhotoSubFilter,
} from "../store/usePhotosStore";
import type { PhotoView } from "../adapters";
import { PhotoSortButton } from "./PhotoSortButton";
import { PhotoUploadButton } from "./PhotoUploadButton";

type PhotosFilterRailProps = {
  eventId: string;
  photos: PhotoView[];
  stats: EventStats | null;
  allCount: number;
};

const FILTER_VALUES: { labelKey: string; value: PhotoSubFilter }[] = [
  { labelKey: "photos__filter__chip_all", value: "all" },
  { labelKey: "photos__filter__chip_favourites", value: "favorites" },
  { labelKey: "photos__filter__chip_gold_book", value: "gold_book" },
];

export const PhotosFilterRail = ({
  eventId,
  photos,
  stats,
  allCount,
}: PhotosFilterRailProps) => {
  const t = useTranslations();
  const subFilter = useSubFilter();
  const setSubFilter = usePhotosStore((s) => s.setSubFilter);
  const selectAll = usePhotosStore((s) => s.selectAll);
  const clearSelection = usePhotosStore((s) => s.clearSelection);
  const selectedIds = usePhotoSelectedIds();

  const statsPhotoCount = stats?.photoCount ?? 0;
  const totalAllCount = Math.max(allCount, statsPhotoCount);

  const chips = FILTER_VALUES.map((c) => ({
    label: t(c.labelKey),
    value: c.value,
    count: c.value === "all" ? totalAllCount : undefined,
  }));

  const chipItems: FilterChipItem[] = chips.map((c) => ({
    label: c.label,
    count: c.count,
  }));

  const activeLabel =
    chips.find((c) => c.value === subFilter)?.label ?? chips[0].label;

  const handleSelect = (label: string) => {
    const next = chips.find((c) => c.label === label);
    if (next) setSubFilter(next.value);
  };

  const allSelected =
    photos.length > 0 && photos.every((p) => selectedIds.has(p.id));

  const handleToggleAll = () => {
    if (allSelected) clearSelection();
    else selectAll(photos.map((p) => p.id));
  };

  if (totalAllCount === 0) return null;

  return (
    <FilterChipRail
      className="border-0 bg-transparent px-0 py-0"
      chips={chipItems}
      activeLabel={activeLabel}
      onSelect={handleSelect}
      leading={
        <Checkbox
          checked={allSelected}
          onChange={handleToggleAll}
          aria-label={t("photos__select_all")}
          className="mr-1 ml-2.5"
        />
      }
      trailing={
        <div className="flex gap-2">
          <PhotoSortButton />
          <PhotoUploadButton eventId={eventId} />
        </div>
      }
    />
  );
};
