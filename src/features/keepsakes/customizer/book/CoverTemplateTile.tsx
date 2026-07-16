"use client";

import { CheckIcon } from "@ovation/icons/CheckIcon";
import { CoverTemplatePreview } from "./CoverTemplatePreview";
import type { CoverTexts } from "./CoverTemplateElement";
import type { CoverTemplate } from "@/lib/api/types";

const TILE_TEXTS: CoverTexts = {
  coverTitle: "Title",
  coverSubtitle: "Subtitle",
  coupleNames: "Names",
  weddingDate: "Date",
};

const mergeTexts = (texts?: CoverTexts): CoverTexts => {
  const merged: CoverTexts = { ...TILE_TEXTS };
  for (const [key, value] of Object.entries(texts ?? {})) {
    if (value) merged[key] = value;
  }
  return merged;
};

type CoverTemplateTileProps = {
  template: CoverTemplate;
  selected: boolean;
  onSelect: (id: string) => void;
  texts?: CoverTexts;
};

export const CoverTemplateTile = ({
  template,
  selected,
  onSelect,
  texts,
}: CoverTemplateTileProps) => (
  <button
    type="button"
    onClick={() => onSelect(template.id)}
    aria-pressed={selected}
    className={`rounded-12 group relative flex flex-col gap-1.5 border-2 p-1.5 text-left transition-[border-color] duration-200 ${
      selected ? "border-primary" : "hover:border-border border-transparent"
    }`}
  >
    <CoverTemplatePreview template={template} texts={mergeTexts(texts)} />
    <span className="type-caption text-center font-medium">
      {template.name}
    </span>
    {selected && (
      <span className="bg-primary text-primary-foreground absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full">
        <CheckIcon width={12} height={12} />
      </span>
    )}
  </button>
);
