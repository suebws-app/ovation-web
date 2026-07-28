"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import { InfoIcon } from "@ovation/icons/InfoIcon";

type FieldHintProps = {
  ariaLabel: string;
  text: string;
};

export const FieldHint = ({ ariaLabel, text }: FieldHintProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <button
        type="button"
        aria-label={ariaLabel}
        className="text-muted-foreground hover:text-foreground shrink-0"
      >
        <InfoIcon width={14} height={14} />
      </button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      sideOffset={6}
      className="rounded-12 type-caption text-muted-foreground max-w-60 p-3 leading-relaxed"
    >
      {text}
    </PopoverContent>
  </Popover>
);
