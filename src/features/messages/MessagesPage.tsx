"use client";

import { useState } from "react";

import { FilterChipRail } from "@/components/FilterChipRail";
import { SelectionToolbar } from "@/components/SelectionToolbar";
import { useSelectionMode } from "@/lib/hooks/useSelectionMode";

import { MessageBatchBar } from "./components/MessageBatchBar";
import { MessageDayList } from "./components/MessageDayList";
import { MessageDetailPane } from "./components/MessageDetailPane";
import { MessageToolbar } from "./components/MessageToolbar";
import { MESSAGE_FILTER_CHIPS, MOCK_MESSAGES } from "./mocks";
import { formatDurationLong } from "./utils";

const PLAYING_ID = "1";

export const MessagesPage = () => {
  const selection = useSelectionMode<string>();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeMessageId, setActiveMessageId] = useState("3");

  const handleRowClick = (id: string) => {
    if (selection.selectMode) {
      selection.toggleSelect(id);
    } else {
      setActiveMessageId(id);
    }
  };

  const activeMessage =
    MOCK_MESSAGES.find((m) => m.id === activeMessageId) ?? MOCK_MESSAGES[0];

  const selectedDurationSec = MOCK_MESSAGES.filter((m) =>
    selection.selectedIds.has(m.id),
  ).reduce((acc, m) => acc + m.durationSec, 0);

  return (
    <div className="tablet:-mb-10 desktop:-mb-20 small-desktop:grid-cols-[1fr_360px] -mx-4 -mb-6 grid min-h-screen">
      <div className="bg-card flex min-w-0 flex-col">
        <MessageToolbar />
        <SelectionToolbar
          selectMode={selection.selectMode}
          count={selection.selectedIds.size}
          onToggle={selection.toggleSelectMode}
          onClearAll={selection.clear}
        />
        {selection.selectMode && (
          <MessageBatchBar
            count={selection.selectedIds.size}
            combinedDuration={formatDurationLong(selectedDurationSec)}
          />
        )}
        <FilterChipRail
          chips={MESSAGE_FILTER_CHIPS}
          activeLabel={activeFilter}
          onSelect={setActiveFilter}
          className="large-desktop:hidden"
        />
        <MessageDayList
          messages={MOCK_MESSAGES}
          selectMode={selection.selectMode}
          selectedIds={selection.selectedIds}
          activeMessageId={activeMessageId}
          playingId={PLAYING_ID}
          onRowClick={handleRowClick}
        />
      </div>
      <MessageDetailPane message={activeMessage} />
    </div>
  );
};
