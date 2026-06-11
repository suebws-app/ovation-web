import { create } from "zustand";
import type { GuestSelectAll } from "@/lib/api/types";
import type { GuestFilter, GuestSort } from "../adapters";

type GuestsState = {
  filter: GuestFilter;
  sort: GuestSort;
  search: string;
  page: number;
  selectedIds: Set<string>;
  selectAll: GuestSelectAll | null;
  setFilter: (filter: GuestFilter) => void;
  setSort: (sort: GuestSort) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  toggleSelected: (id: string) => void;
  selectAllIds: (ids: string[]) => void;
  setSelectAll: (next: GuestSelectAll | null) => void;
  clearSelection: () => void;
};

const resetSelection = {
  selectedIds: new Set<string>(),
  selectAll: null as GuestSelectAll | null,
};

export const useGuestsStore = create<GuestsState>((set) => ({
  filter: "all",
  sort: "recent",
  search: "",
  page: 1,
  selectedIds: new Set<string>(),
  selectAll: null,
  setFilter: (filter) => set({ filter, page: 1, ...resetSelection }),
  setSort: (sort) => set({ sort, page: 1, ...resetSelection }),
  setSearch: (search) => set({ search, page: 1, ...resetSelection }),
  setPage: (page) => set({ page }),
  toggleSelected: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  selectAllIds: (ids) => set({ selectedIds: new Set(ids) }),
  setSelectAll: (next) => set({ selectAll: next }),
  clearSelection: () => set({ selectedIds: new Set(), selectAll: null }),
}));

export const useGuestFilter = () => useGuestsStore((s) => s.filter);
export const useGuestSort = () => useGuestsStore((s) => s.sort);
export const useGuestSearch = () => useGuestsStore((s) => s.search);
export const useGuestPage = () => useGuestsStore((s) => s.page);
export const useGuestSelectedIds = () => useGuestsStore((s) => s.selectedIds);
export const useGuestSelectAll = () => useGuestsStore((s) => s.selectAll);
