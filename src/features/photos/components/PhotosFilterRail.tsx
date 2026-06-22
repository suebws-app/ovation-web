"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@ovation/ui/components/Checkbox";
import {
  FilterChipRail,
  type FilterChipItem,
} from "@/components/FilterChipRail";
import type { EventStats } from "@/lib/api/types";
import {
  usePhotoSelectAll,
  usePhotosStore,
  useSubFilter,
  type PhotoSubFilter,
} from "../store/usePhotosStore";
import { PhotoSortButton } from "./PhotoSortButton";

type PhotosFilterRailProps = {
  stats: EventStats | null;
  allCount: number;
};

const FILTER_VALUES: { labelKey: string; value: PhotoSubFilter }[] = [
  { labelKey: "photos__filter__chip_all", value: "all" },
  { labelKey: "photos__filter__chip_favourites", value: "favorites" },
  { labelKey: "photos__filter__chip_gold_book", value: "gold_book" },
];

export const PhotosFilterRail = ({
  stats,
  allCount,
}: PhotosFilterRailProps) => {
  const t = useTranslations();
  const subFilter = useSubFilter();
  const setSubFilter = usePhotosStore((s) => s.setSubFilter);
  const setSelectAll = usePhotosStore((s) => s.setSelectAll);
  const clearSelection = usePhotosStore((s) => s.clearSelection);
  const selectAll = usePhotoSelectAll();
  const search = usePhotosStore((s) => s.search);

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

  const selectAllActive = selectAll !== null;

  const handleToggleAll = () => {
    if (selectAllActive) {
      clearSelection();
    } else {
      const trimmed = search.trim();
      clearSelection();
      setSelectAll({
        filter: subFilter,
        search: trimmed || undefined,
        excludedIds: [],
      });
    }
  };

  if (totalAllCount === 0) return null;

  return (
    <FilterChipRail
      className="min-w-0 flex-1 border-0 bg-transparent px-0 py-0"
      chips={chipItems}
      activeLabel={activeLabel}
      onSelect={handleSelect}
      leading={
        <Checkbox
          checked={selectAllActive}
          onChange={handleToggleAll}
          aria-label={t("photos__select_all")}
          className="mr-1 ml-2.5"
        />
      }
      trailing={
        <div className="flex gap-2">
          <PhotoSortButton />
        </div>
      }
    />
  );
};
