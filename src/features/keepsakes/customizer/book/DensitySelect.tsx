"use client";

import { useTranslations } from "next-intl";
import { useWatch } from "react-hook-form";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { CustomizerSection } from "../CustomizerSection";
import {
  useBookForm,
  type BookBinding,
  type BookFormValues,
} from "./BookFormContext";

type Density = "spacious" | "balanced" | "compact";

// Mini box previews (percent) hinting at each density's packing.
const THUMBS: Record<
  Density,
  Array<{ x: number; y: number; w: number; h: number }>
> = {
  spacious: [{ x: 8, y: 8, w: 84, h: 84 }],
  balanced: [
    { x: 8, y: 8, w: 84, h: 40 },
    { x: 8, y: 52, w: 40, h: 40 },
    { x: 52, y: 52, w: 40, h: 40 },
  ],
  compact: [
    { x: 8, y: 8, w: 52, h: 84 },
    { x: 64, y: 8, w: 28, h: 40 },
    { x: 64, y: 52, w: 28, h: 40 },
  ],
};

const OPTIONS: Density[] = ["spacious", "balanced", "compact"];

type DensityTileProps = {
  value: Density;
  selected: boolean;
  onSelect: (value: Density) => void;
};

const DensityTile = ({ value, selected, onSelect }: DensityTileProps) => {
  const t = useTranslations();
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={selected}
      className={`rounded-12 relative flex flex-col gap-2 border-2 p-2.5 text-left transition-[border-color] duration-200 ${
        selected ? "border-primary" : "hover:border-border border-transparent"
      }`}
    >
      <span className="bg-muted/40 rounded-8 relative block aspect-square w-full">
        {THUMBS[value].map((b, i) => (
          <span
            key={i}
            className="bg-primary/25 rounded-2 absolute"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
            }}
          />
        ))}
      </span>
      <span className="type-body-small font-semibold">
        {t(`keepsakes__book_customizer__density_${value}_label`)}
      </span>
      <span className="type-caption text-muted-foreground leading-tight">
        {t(`keepsakes__book_customizer__density_${value}_blurb`)}
      </span>
      {selected && (
        <span className="bg-primary text-primary-foreground absolute top-2 right-2 flex size-5 items-center justify-center rounded-full">
          <CheckIcon width={12} height={12} />
        </span>
      )}
    </button>
  );
};

type DensitySelectProps = {
  binding: BookBinding;
};

export const DensitySelect = ({ binding }: DensitySelectProps) => {
  const t = useTranslations();
  const { setValue } = useBookForm();
  const density = useWatch<BookFormValues, "interiorDensity">({
    name: "interiorDensity",
  });

  // Layflat only offers Spacious (full-bleed spreads); denser packing is hidden.
  const options: Density[] = binding === "layflat" ? ["spacious"] : OPTIONS;

  if (options.length <= 1) return null;

  const selectDensity = (value: Density) =>
    setValue("interiorDensity", value, { shouldDirty: true });

  return (
    <CustomizerSection
      title={t("keepsakes__book_customizer__density_section_title")}
      description={t("keepsakes__book_customizer__density_section_description")}
    >
      <div className="grid grid-cols-3 gap-2">
        {options.map((value) => (
          <DensityTile
            key={value}
            value={value}
            selected={(density ?? "spacious") === value}
            onSelect={selectDensity}
          />
        ))}
      </div>
    </CustomizerSection>
  );
};
