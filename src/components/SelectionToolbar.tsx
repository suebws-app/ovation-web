"use client";

import { Button } from "@ovation/ui/components/Button";

type SelectionToolbarProps = {
  selectMode: boolean;
  count: number;
  onToggle: () => void;
  onClearAll: () => void;
};

export const SelectionToolbar = ({
  selectMode,
  count,
  onToggle,
  onClearAll,
}: SelectionToolbarProps) => (
  <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 tablet:px-7">
    <Button
      variant={selectMode ? "default" : "outline"}
      size="sm"
      onClick={onToggle}
      className="rounded-full"
    >
      {selectMode ? `Cancel (${count})` : "Select"}
    </Button>
    {selectMode && count > 0 && (
      <button
        type="button"
        onClick={onClearAll}
        className="cursor-pointer type-caption font-semibold text-primary"
      >
        Clear all
      </button>
    )}
  </div>
);
