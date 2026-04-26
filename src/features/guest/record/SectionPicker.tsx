"use client";

import { useTranslations } from "next-intl";
import { Mic } from "@ovation/icons/Mic";
import { ImageIcon } from "@ovation/icons/ImageIcon";
import { Heart } from "@ovation/icons/Heart";
import { SectionButton } from "./SectionButton";

export type SectionKey = "audio" | "video" | "photo" | "note";

const SECTION_KEYS: {
  key: SectionKey;
  labelKey: string;
  icon: typeof Mic;
}[] = [
  { key: "audio", labelKey: "guest__record__section_voice", icon: Mic },
  { key: "video", labelKey: "guest__record__section_video", icon: Mic },
  { key: "photo", labelKey: "guest__record__section_photo", icon: ImageIcon },
  { key: "note", labelKey: "guest__record__section_note", icon: Heart },
];

type SectionPickerProps = {
  openSections: Set<SectionKey>;
  filled: Record<SectionKey, boolean>;
  onToggle: (key: SectionKey) => void;
};

export const SectionPicker = ({
  openSections,
  filled,
  onToggle,
}: SectionPickerProps) => {
  const t = useTranslations();
  return (
    <div className="rounded-16 bg-background/60 border-border border p-3 backdrop-blur">
      <p className="type-caption text-foreground/65 mb-2 px-2 font-semibold tracking-wide uppercase">
        {t("guest__record__add_to_message")}
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {SECTION_KEYS.map((section) => (
          <SectionButton
            key={section.key}
            section={section}
            open={openSections.has(section.key)}
            filled={filled[section.key]}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
};
