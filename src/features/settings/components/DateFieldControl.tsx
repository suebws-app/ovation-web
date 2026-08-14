"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Calendar } from "@ovation/ui/components/DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import { cn } from "@ovation/ui/utils/cn";
import { CalendarIcon } from "@ovation/icons/CalendarIcon";
import { toIsoDate, parseIsoDate } from "@/lib/utils/formatDate";
import { getDateFnsLocale } from "@/lib/utils/dateFnsLocale";

type DateFieldControlProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  invalid?: boolean;
};

export const DateFieldControl = ({
  value,
  onChange,
  placeholder,
  invalid = false,
}: DateFieldControlProps) => {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const selectedDate = parseIsoDate(value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-invalid={invalid}
          className={cn(
            "bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-ring hover:border-primary/40 flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
            invalid
              ? "border-destructive ring-destructive ring-1"
              : "border-border",
          )}
        >
          <CalendarIcon
            width={16}
            height={16}
            className="text-primary shrink-0"
          />
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              selectedDate ? "font-medium" : "text-muted-foreground",
            )}
          >
            {selectedDate
              ? selectedDate.toLocaleDateString(locale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="rounded-16 w-auto p-3"
      >
        <Calendar
          mode="single"
          locale={getDateFnsLocale(locale)}
          selected={selectedDate}
          onSelect={(date) => {
            onChange(date ? toIsoDate(date) : "");
            setOpen(false);
          }}
          className="mx-auto"
        />
      </PopoverContent>
    </Popover>
  );
};
