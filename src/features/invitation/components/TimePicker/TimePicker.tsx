"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@ovation/ui/components/Input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import { ClockIcon } from "@ovation/icons/ClockIcon";
import { TimeColumn } from "./TimeColumn";

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

type TimeParts = {
  hour: string | null;
  minute: string | null;
  period: string | null;
};

const DISPLAY_PATTERN = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

const pad = (value: number): string => String(value).padStart(2, "0");

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, index) => pad(index + 1));
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) => pad(index));
const PERIOD_OPTIONS = ["AM", "PM"];

const parseValue = (value: string): TimeParts => {
  const match = DISPLAY_PATTERN.exec(value.trim());
  if (!match) return { hour: null, minute: null, period: null };
  return {
    hour: pad(Number(match[1])),
    minute: match[2],
    period: match[3].toUpperCase(),
  };
};

const composeValue = (parts: TimeParts): string => {
  const hour = parts.hour ?? "12";
  const minute = parts.minute ?? "00";
  const period = parts.period ?? "AM";
  return `${hour}:${minute} ${period}`;
};

export const TimePicker = ({ value, onChange }: TimePickerProps) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [parts, setParts] = useState<TimeParts>(() => parseValue(value));

  const handleOpenChange = (next: boolean) => {
    if (next) setParts(parseValue(value));
    setOpen(next);
  };

  const commit = (nextParts: TimeParts, close: boolean) => {
    setParts(nextParts);
    onChange(composeValue(nextParts));
    if (close) setOpen(false);
  };

  const handleHourSelect = (hour: string) => {
    commit({ ...parts, hour }, false);
  };

  const handleMinuteSelect = (minute: string) => {
    commit({ ...parts, minute }, false);
  };

  const handlePeriodSelect = (period: string) => {
    commit({ ...parts, period }, true);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor asChild>
        <div className="relative w-40">
          <Input
            readOnly
            value={value}
            placeholder={t("invitation__placeholder__time")}
            aria-label={t("invitation__field__time")}
            className="border-primary/30 focus-visible:ring-primary rounded-12 cursor-default pr-10"
          />
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={t("invitation__field__time")}
              className="text-primary focus-visible:ring-primary rounded-8 absolute inset-y-0 right-0 flex items-center pr-3 focus-visible:ring-2 focus-visible:outline-none"
            >
              <ClockIcon width={16} height={16} />
            </button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent align="start" className="rounded-12 w-auto">
        <div className="flex gap-1.5">
          <TimeColumn
            options={HOUR_OPTIONS}
            selected={parts.hour ?? ""}
            onSelect={handleHourSelect}
            ariaLabel={t("invitation__field__time_hour")}
          />
          <TimeColumn
            options={MINUTE_OPTIONS}
            selected={parts.minute ?? ""}
            onSelect={handleMinuteSelect}
            ariaLabel={t("invitation__field__time_minute")}
          />
          <TimeColumn
            options={PERIOD_OPTIONS}
            selected={parts.period ?? ""}
            onSelect={handlePeriodSelect}
            ariaLabel={t("invitation__field__time_period")}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
