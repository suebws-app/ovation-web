"use client";

import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import {
  EVENT_THEME_PRESETS,
  resolveEventThemePreset,
  scaleFor,
  type EventThemePreset,
} from "@/lib/theme/eventThemePresets";

type ThemeSwatchPickerProps = {
  value: string;
  onChange: (hex: string) => void;
  eventType?: string | null;
  presets?: EventThemePreset[];
  className?: string;
};

/**
 * Round color-swatch picker over the event theme presets. Writes the selected
 * preset's `baseHex` via `onChange`. Shared by the settings theme field and the
 * create-wizard cover step; pass a `presets` subset to show fewer swatches.
 */
export const ThemeSwatchPicker = ({
  value,
  onChange,
  eventType,
  presets = EVENT_THEME_PRESETS,
  className,
}: ThemeSwatchPickerProps) => {
  const t = useTranslations();
  const selected = resolveEventThemePreset({ themeColor: value, eventType });

  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {presets.map((preset) => {
        const isSelected = preset.id === selected.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.baseHex)}
            aria-pressed={isSelected}
            title={t(preset.nameKey)}
            className={cn(
              "focus-visible:ring-ring relative size-9 rounded-full border transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:outline-none",
              isSelected
                ? "border-foreground ring-foreground/20 ring-2"
                : "border-border",
            )}
            style={{
              background: scaleFor(preset.hue, preset.chromaMul, preset.deep)
                .light.primary,
            }}
          >
            {isSelected && (
              <CheckIcon
                width={16}
                height={16}
                className="text-primary-foreground absolute inset-0 m-auto"
              />
            )}
            <span className="sr-only">{t(preset.nameKey)}</span>
          </button>
        );
      })}
    </div>
  );
};
