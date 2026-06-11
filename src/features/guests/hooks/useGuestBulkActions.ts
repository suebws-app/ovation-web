"use client";

import { useMutation } from "@tanstack/react-query";
import { guestsClient } from "@/lib/api/guests-client";
import { saveBlob } from "@/lib/utils/download-blob";
import {
  useGuestSelectAll,
  useGuestSelectedIds,
} from "../store/useGuestsStore";

const formatDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const useGuestBulkActions = (eventId: string) => {
  const selectAll = useGuestSelectAll();
  const selectedIds = useGuestSelectedIds();

  const mutation = useMutation({
    mutationFn: async () => {
      const body = selectAll
        ? { selectAll }
        : { guestNames: Array.from(selectedIds) };
      const blob = await guestsClient.bulkExportCsv(eventId, body);
      saveBlob(blob, `guests ${formatDate(new Date())}.csv`);
    },
  });

  return {
    exportCsv: () => mutation.mutate(),
    isExporting: mutation.isPending,
    isAllMode: Boolean(selectAll),
  };
};
