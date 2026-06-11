import { create } from "zustand";
import type { PhotoSelectAll } from "@/lib/api/types";

export type PhotoSubFilter = "all" | "favorites" | "gold_book";
export type PhotoSort = "newest" | "oldest";

type PhotosState = {
  subFilter: PhotoSubFilter;
  sort: PhotoSort;
  search: string;
  selectedIds: Set<string>;
  selectAll: PhotoSelectAll | null;
  lightboxIndex: number | null;
  setSubFilter: (next: PhotoSubFilter) => void;
  setSort: (next: PhotoSort) => void;
  setSearch: (next: string) => void;
  toggleSelected: (id: string) => void;
  setSelectAll: (next: PhotoSelectAll | null) => void;
  clearSelection: () => void;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  setLightboxIndex: (index: number) => void;
};

const initial = {
  subFilter: "all" as PhotoSubFilter,
  sort: "newest" as PhotoSort,
  search: "",
  selectedIds: new Set<string>(),
  selectAll: null as PhotoSelectAll | null,
  lightboxIndex: null as number | null,
};

const resetSelection = {
  selectedIds: new Set<string>(),
  selectAll: null as PhotoSelectAll | null,
};

export const usePhotosStore = create<PhotosState>((set) => ({
  ...initial,
  setSubFilter: (next) =>
    set({
      subFilter: next,
      ...resetSelection,
      lightboxIndex: null,
    }),
  setSort: (next) =>
    set({
      sort: next,
      ...resetSelection,
      lightboxIndex: null,
    }),
  setSearch: (next) =>
    set({
      search: next,
      ...resetSelection,
      lightboxIndex: null,
    }),
  toggleSelected: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  setSelectAll: (next) => set({ selectAll: next }),
  clearSelection: () => set({ selectedIds: new Set(), selectAll: null }),
  openLightbox: (index) => set({ lightboxIndex: index }),
  closeLightbox: () => set({ lightboxIndex: null }),
  setLightboxIndex: (index) => set({ lightboxIndex: index }),
}));

export const useSubFilter = () => usePhotosStore((s) => s.subFilter);
export const usePhotoSort = () => usePhotosStore((s) => s.sort);
export const usePhotoSearch = () => usePhotosStore((s) => s.search);
export const usePhotoSelectedIds = () => usePhotosStore((s) => s.selectedIds);
export const usePhotoSelectAll = () => usePhotosStore((s) => s.selectAll);
export const useLightboxIndex = () => usePhotosStore((s) => s.lightboxIndex);
