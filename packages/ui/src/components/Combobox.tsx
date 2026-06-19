"use client";

import { useState } from "react";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { ChevronDownIcon } from "@ovation/icons/ChevronDownIcon";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./Command";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { cn } from "../utils/cn";

export type ComboboxOption<T extends string> = {
  value: T;
  label: string;
};

type ComboboxOptionItemProps<T extends string> = {
  option: ComboboxOption<T>;
  isActive: boolean;
  onSelect: (value: T) => void;
};

const ComboboxOptionItem = <T extends string>({
  option,
  isActive,
  onSelect,
}: ComboboxOptionItemProps<T>) => {
  const handleSelect = () => onSelect(option.value);

  return (
    <CommandItem
      value={`${option.value} ${option.label}`}
      onSelect={handleSelect}
      className={cn(
        "type-body-small text-foreground rounded-8 data-[selected=true]:bg-muted data-[selected=true]:text-foreground flex w-full cursor-pointer items-center justify-between gap-2 px-2.5 py-2 pr-2.5",
        isActive && "bg-muted/60",
      )}
    >
      <span className="truncate">{option.label}</span>
      {isActive && <CheckIcon className="text-foreground size-3 shrink-0" />}
    </CommandItem>
  );
};

type ComboboxProps<T extends string> = {
  value: T | undefined;
  onValueChange: (value: T) => void;
  options: ComboboxOption<T>[];
  ariaLabel?: string;
  placeholder?: string;
  search?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
};

export const Combobox = <T extends string>({
  value,
  onValueChange,
  options,
  ariaLabel,
  placeholder,
  search = false,
  searchPlaceholder,
  emptyMessage,
  className,
  contentClassName,
  disabled,
}: ComboboxProps<T>) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  const handleSelect = (next: T) => {
    setOpen(false);
    onValueChange(next);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(
          "group border-border bg-background text-foreground focus-visible:ring-ring tablet:text-sm flex h-10 w-full cursor-pointer items-center justify-between gap-1.5 rounded-lg border px-3 py-2 text-left text-base transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-150 group-data-[state=open]:rotate-180" />
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-(--radix-popover-trigger-width) rounded-lg p-0",
          contentClassName,
        )}
        align="start"
        sideOffset={6}
      >
        <Command shouldFilter={search}>
          {search && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList className="max-h-44">
            {search && emptyMessage && (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            )}
            {options.map((option) => (
              <ComboboxOptionItem
                key={option.value}
                option={option}
                isActive={option.value === value}
                onSelect={handleSelect}
              />
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
