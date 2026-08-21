"use client";

import { useTranslations } from "next-intl";
import {
  EVENT_THEME_PRESETS,
  resolveEventThemePreset,
  scaleFor,
  type EventThemePresetId,
} from "@/lib/theme/eventThemePresets";
import { CoverColorTile } from "./CoverColorTile";

const COVER_PRESET_IDS: EventThemePresetId[] = [
  "blush",
  "deep_orange",
  "green",
  "blue",
  "purple",
  "grey",
];

const COVER_PRESETS = COVER_PRESET_IDS.map((id) =>
  EVENT_THEME_PRESETS.find((p) => p.id === id),
).filter((p): p is (typeof EVENT_THEME_PRESETS)[number] => Boolean(p));

type CoverColorSelectorProps = {
  value: string;
  onChange: (hex: string) => void;
  eventType?: string | null;
  initials: string;
};

export const CoverColorSelector = ({
  value,
  onChange,
  eventType,
  initials,
}: CoverColorSelectorProps) => {
  const t = useTranslations();
  const selected = resolveEventThemePreset({ themeColor: value, eventType });

  return (
    <div className="tablet:grid-cols-6 tablet:gap-2 grid grid-cols-3 gap-2">
      {COVER_PRESETS.map((preset) => (
        <CoverColorTile
          key={preset.id}
          label={t(preset.nameKey)}
          color={
            scaleFor(
              preset.hue,
              preset.chromaMul,
              preset.deep,
              preset.primaryL,
              preset.primaryC,
            ).light.primary
          }
          initials={initials}
          selected={preset.id === selected.id}
          onClick={() => onChange(preset.baseHex)}
        />
      ))}
    </div>
  );
};
