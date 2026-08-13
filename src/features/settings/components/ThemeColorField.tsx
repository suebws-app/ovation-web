"use client";

import { ThemeSwatchPicker } from "@/components/ThemeSwatchPicker";

type ThemeColorFieldProps = {
  value: string;
  onChange: (hex: string) => void;
  eventType?: string | null;
};

export const ThemeColorField = ({
  value,
  onChange,
  eventType,
}: ThemeColorFieldProps) => (
  <ThemeSwatchPicker value={value} onChange={onChange} eventType={eventType} />
);
