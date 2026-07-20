"use client";

import { useTranslations } from "next-intl";
import { useWatch } from "react-hook-form";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { CustomizerSection } from "../CustomizerSection";
import { useBookForm, type BookFormValues } from "./BookFormContext";

type Density = "spacious" | "balanced" | "asymmetrical";

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
  asymmetrical: [
    { x: 8, y: 8, w: 46, h: 50 },
    { x: 60, y: 8, w: 32, h: 34 },
    { x: 8, y: 64, w: 84, h: 28 },
  ],
};

const OPTIONS: Density[] = ["spacious", "balanced", "asymmetrical"];

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
      className={`rounded-12 relative flex w-40 shrink-0 flex-col gap-2 border-2 p-2.5 text-left transition-[border-color] duration-200 ${
        selected ? "border-primary" : "hover:border-border border-transparent"
      }`}
    >
      <span className="bg-muted/40 rounded-8 relative block h-28 w-full">
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

export const DensitySelect = () => {
  const t = useTranslations();
  const { setValue } = useBookForm();
  const density = useWatch<BookFormValues, "interiorDensity">({
    name: "interiorDensity",
  });

  // All bindings (including layflat) offer all three densities: Spacious
  // (full-bleed), Balanced (an even 1-2 photos per page in a symmetric grid),
  // and Asymmetrical (photos spread unevenly).
  const options: Density[] = OPTIONS;

  const selectDensity = (value: Density) =>
    setValue("interiorDensity", value, { shouldDirty: true });

  return (
    <CustomizerSection
      title={t("keepsakes__book_customizer__density_section_title")}
      description={t("keepsakes__book_customizer__density_section_description")}
    >
      <div className="flex flex-wrap gap-2">
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
