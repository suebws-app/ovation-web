"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./Command";
import { cn } from "../utils/cn";

export type MultiSelectOption<T extends string = string> = {
  value: T;
  label: string;
  keywords?: string[];
  disabled?: boolean;
};

type MultiSelectProps<T extends string = string> = {
  value: T[];
  onChange: (next: T[]) => void;
  options: MultiSelectOption<T>[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  searchable?: boolean;
  disabled?: boolean;
  align?: "start" | "center" | "end";
  className?: string;
  contentClassName?: string;
  ariaLabel?: string;
  renderTriggerLabel?: (selected: MultiSelectOption<T>[]) => React.ReactNode;
};

const defaultTriggerLabel = <T extends string>(
  selected: MultiSelectOption<T>[],
) => {
  if (selected.length === 0) return null;
  if (selected.length === 1) return selected[0].label;
  return `${selected[0].label} +${selected.length - 1}`;
};

const MultiSelectItem = <T extends string>({
  option,
  checked,
  onToggle,
}: {
  option: MultiSelectOption<T>;
  checked: boolean;
  onToggle: (value: T) => void;
}) => (
  <CommandItem
    value={[option.value, option.label, ...(option.keywords ?? [])].join(" ")}
    disabled={option.disabled}
    onSelect={() => onToggle(option.value)}
    className="rounded-8! justify-between! gap-3! py-2! pr-2.5! pl-2.5!"
  >
    <span className="truncate">{option.label}</span>
    <span
      aria-hidden
      className={cn(
        "rounded-4 flex size-4 shrink-0 items-center justify-center border transition-colors",
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-transparent",
      )}
    >
      {checked ? <CheckIcon className="size-2.5" strokeWidth={3} /> : null}
    </span>
  </CommandItem>
);

export const MultiSelect = <T extends string = string>({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  searchable = true,
  disabled = false,
  align = "start",
  className,
  contentClassName,
  ariaLabel,
  renderTriggerLabel,
}: MultiSelectProps<T>) => {
  const [open, setOpen] = React.useState(false);

  const selectedOptions = React.useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value],
  );

  const toggle = React.useCallback(
    (next: T) => {
      if (value.includes(next)) {
        onChange(value.filter((v) => v !== next));
      } else {
        onChange([...value, next]);
      }
    },
    [value, onChange],
  );

  const triggerLabel = renderTriggerLabel
    ? renderTriggerLabel(selectedOptions)
    : defaultTriggerLabel(selectedOptions);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 type-body-small hover:bg-muted rounded-8 flex h-9 w-fit min-w-48 cursor-pointer items-center justify-between gap-2 border bg-transparent px-3 transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <span className="truncate text-left">
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            triggerLabel
          )}
        </span>
        <ChevronDownIcon className="text-muted-foreground size-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn(
          "w-(--radix-popover-trigger-width) min-w-48 p-0",
          contentClassName,
        )}
      >
        <Command shouldFilter={searchable}>
          {searchable ? <CommandInput placeholder={searchPlaceholder} /> : null}
          <CommandList>
            {emptyText ? <CommandEmpty>{emptyText}</CommandEmpty> : null}
            {options.map((option) => (
              <MultiSelectItem
                key={option.value}
                option={option}
                checked={value.includes(option.value)}
                onToggle={toggle}
              />
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
