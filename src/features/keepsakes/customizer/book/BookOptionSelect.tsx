"use client";

import { useState } from "react";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { ChevronDownIcon } from "@ovation/icons/ChevronDownIcon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import { cn } from "@ovation/ui/utils/cn";

export type BookOptionSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type BookOptionSelectProps = {
  id?: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: BookOptionSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  emptyLabel?: string;
  className?: string;
};

export const BookOptionSelect = ({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  emptyLabel,
  className,
}: BookOptionSelectProps) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  const triggerLabel = selected?.label ?? placeholder ?? "";

  const handleSelect = (next: string) => {
    onValueChange(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        type="button"
        disabled={disabled}
        className={cn(
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 hover:bg-muted dark:bg-input/30 type-body-small rounded-8 flex h-9 w-full cursor-pointer items-center justify-between gap-1.5 border bg-transparent py-2 pr-2 pl-2.5 whitespace-nowrap transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50",
          !selected && "text-muted-foreground",
          className,
        )}
      >
        <span className="line-clamp-1 flex items-center gap-1.5 text-left">
          {triggerLabel}
        </span>
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="flex w-(--radix-popover-trigger-width) flex-col gap-0 p-1"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {options.length === 0 ? (
          <div className="text-muted-foreground type-body-small px-1.5 py-1">
            {emptyLabel}
          </div>
        ) : (
          options.map((option) => (
            <BookOptionSelectItem
              key={option.value}
              option={option}
              isSelected={option.value === value}
              onSelect={handleSelect}
            />
          ))
        )}
      </PopoverContent>
    </Popover>
  );
};

type BookOptionSelectItemProps = {
  option: BookOptionSelectOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
};

const BookOptionSelectItem = ({
  option,
  isSelected,
  onSelect,
}: BookOptionSelectItemProps) => {
  return (
    <button
      type="button"
      disabled={option.disabled}
      onClick={() => onSelect(option.value)}
      className="hover:bg-primary hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground type-body-small rounded-8 relative flex w-full cursor-pointer items-center gap-1.5 py-1.5 pr-8 pl-1.5 text-left outline-none disabled:pointer-events-none disabled:opacity-50"
    >
      <span className="line-clamp-1 flex-1">{option.label}</span>
      {isSelected ? <CheckIcon className="absolute right-2 size-4" /> : null}
    </button>
  );
};
