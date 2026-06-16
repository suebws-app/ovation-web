"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ovation/ui/components/Select";
import { US_STATES } from "../data/us-states";
import { CA_PROVINCES } from "../data/ca-provinces";
import type { StateOption } from "../data/us-states";

type StateSelectProps = {
  country: string;
  value: string;
  onChange: (state: string) => void;
  invalid?: boolean;
  disabled?: boolean;
};

const optionsForCountry = (country: string): StateOption[] | null => {
  if (country === "US") return US_STATES;
  if (country === "CA") return CA_PROVINCES;
  return null;
};

export const requiresState = (country: string): boolean =>
  optionsForCountry(country) !== null;

export const StateSelect = ({
  country,
  value,
  onChange,
  invalid,
  disabled,
}: StateSelectProps) => {
  const t = useTranslations();
  const options = optionsForCountry(country);
  const savedScrollRef = useRef<number | null>(null);
  if (!options) return null;

  const handleOpenChange = (open: boolean) => {
    if (open) {
      savedScrollRef.current = window.scrollY;
      requestAnimationFrame(() => {
        if (savedScrollRef.current !== null) {
          window.scrollTo({ top: savedScrollRef.current, behavior: "instant" });
        }
      });
    } else {
      savedScrollRef.current = null;
    }
  };

  return (
    <Select
      value={value || undefined}
      onValueChange={onChange}
      onOpenChange={handleOpenChange}
      disabled={disabled}
    >
      <SelectTrigger aria-invalid={invalid} className="w-full">
        <SelectValue placeholder={t("cart__shipping__state_placeholder")} />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4} className="max-h-72">
        {options.map((option) => (
          <SelectItem key={option.code} value={option.code}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
