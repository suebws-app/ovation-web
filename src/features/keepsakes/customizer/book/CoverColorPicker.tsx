"use client";

import { useTranslations } from "next-intl";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { Button } from "@ovation/ui/components/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";

type CoverColorPickerProps = {
  value: string;
  defaultHex: string;
  label: string;
  description?: string;
  onChange: (hex: string) => void;
  onReset: () => void;
};

export const CoverColorPicker = ({
  value,
  defaultHex,
  label,
  description,
  onChange,
  onReset,
}: CoverColorPickerProps) => {
  const t = useTranslations();

  const activeHex = value || defaultHex;
  const isCustom = Boolean(value);

  return (
    <div>
      <h3 className="type-body-small font-semibold">{label}</h3>
      {description && (
        <p className="type-caption text-muted-foreground mt-0.5 leading-relaxed">
          {description}
        </p>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={label}
            className="border-border hover:border-primary/40 focus-visible:ring-ring rounded-12 mt-2 flex items-center gap-2 border px-3 py-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <span
              className="border-border/60 size-5 rounded-full border"
              style={{ backgroundColor: activeHex }}
            />
            <span className="type-body-small font-medium">
              {isCustom
                ? activeHex.toUpperCase()
                : t("keepsakes__book_customizer__cover_color_default")}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="rounded-16 w-auto p-3"
        >
          <div className="flex flex-col gap-3">
            <HexColorPicker color={activeHex} onChange={onChange} />
            <div className="flex items-center gap-2">
              <span className="type-caption text-muted-foreground">#</span>
              <HexColorInput
                color={activeHex}
                onChange={onChange}
                className="border-border focus-visible:ring-ring type-body-small rounded-8 w-24 border px-2 py-1 uppercase focus-visible:ring-2 focus-visible:outline-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="ml-auto"
              >
                {t("keepsakes__book_customizer__cover_color_default")}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
