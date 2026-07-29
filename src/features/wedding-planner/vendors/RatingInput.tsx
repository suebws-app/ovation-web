"use client";

import { cn } from "@ovation/ui/utils/cn";
import { StarIcon } from "@ovation/icons/StarIcon";

const STARS = [1, 2, 3, 4, 5];

type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
};

export const RatingInput = ({
  value,
  onChange,
  ariaLabel,
}: RatingInputProps) => (
  <div className="flex gap-1" role="radiogroup" aria-label={ariaLabel}>
    {STARS.map((star) => (
      <button
        key={star}
        type="button"
        role="radio"
        aria-checked={value === star}
        aria-label={String(star)}
        onClick={() => onChange(value === star ? 0 : star)}
        className="cursor-pointer"
      >
        <StarIcon
          width={22}
          height={22}
          className={cn(star <= value ? "text-accent" : "text-border")}
        />
      </button>
    ))}
  </div>
);
