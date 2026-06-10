import { create } from "zustand";
import type { MessageFilter } from "@/lib/api/types";

export type MessageSortOption = "newest" | "oldest" | "longest";

type MessagesState = {
  filter: MessageFilter;
  sort: MessageSortOption;
  search: string;
  page: number;
  selectedIds: Set<string>;
  activeMessageId: string | null;
  setFilter: (filter: MessageFilter) => void;
  setSort: (sort: MessageSortOption) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  toggleSelected: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setActiveMessageId: (id: string | null) => void;
  toggleActiveMessageId: (id: string) => void;
  reset: () => void;
};

const initial = {
  filter: "all" as MessageFilter,
  sort: "newest" as MessageSortOption,
  search: "",
  page: 1,
  selectedIds: new Set<string>(),
  activeMessageId: null as string | null,
};

export const useMessagesStore = create<MessagesState>((set) => ({
  ...initial,
  setFilter: (filter) =>
    set({ filter, page: 1, selectedIds: new Set(), activeMessageId: null }),
  setSort: (sort) => set({ sort, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  toggleSelected: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  clearSelection: () => set({ selectedIds: new Set() }),
  setActiveMessageId: (id) => set({ activeMessageId: id }),
  toggleActiveMessageId: (id) =>
    set((s) => ({ activeMessageId: s.activeMessageId === id ? null : id })),
  reset: () => set({ ...initial, selectedIds: new Set() }),
}));

export const useFilter = () => useMessagesStore((s) => s.filter);
export const useMessageSort = () => useMessagesStore((s) => s.sort);
export const useMessageSearch = () => useMessagesStore((s) => s.search);
export const useMessagePage = () => useMessagesStore((s) => s.page);
export const useSelectedIds = () => useMessagesStore((s) => s.selectedIds);
export const useActiveMessageId = () =>
  useMessagesStore((s) => s.activeMessageId);
