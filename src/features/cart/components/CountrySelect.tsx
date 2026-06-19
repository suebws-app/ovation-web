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
import { useShippingCountries } from "@/lib/query/shippingQueries";

type CountrySelectProps = {
  value: string;
  onChange: (countryCode: string) => void;
  variantIds: string[];
  invalid?: boolean;
  disabled?: boolean;
};

export const CountrySelect = ({
  value,
  onChange,
  variantIds,
  invalid,
  disabled,
}: CountrySelectProps) => {
  const t = useTranslations();
  const { data, isLoading, isError } = useShippingCountries(variantIds);
  const savedScrollRef = useRef<number | null>(null);

  const countries = data?.countries ?? [];

  const placeholder = isError
    ? t("cart__shipping__country_error")
    : isLoading
      ? t("cart__shipping__country_loading")
      : t("cart__shipping__country_select_placeholder");

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
      disabled={disabled || isLoading}
    >
      <SelectTrigger aria-invalid={invalid} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4} className="max-h-72">
        {countries.map((country) => (
          <SelectItem key={country.countryCode} value={country.countryCode}>
            {country.countryName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
