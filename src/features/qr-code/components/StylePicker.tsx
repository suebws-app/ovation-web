"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { Eyebrow } from "@ovation/ui/components/Eyebrow";
import { StyleOption } from "./StyleOption";

export const StylePicker = () => {
  const t = useTranslations();
  const [selected, setSelected] = useState("classic");
  const [showLogo, setShowLogo] = useState(true);

  const styles = [
    {
      id: "classic",
      label: t("qr_code__style__classic"),
      dark: "#2D2D2D",
      light: "#fff",
    },
    {
      id: "blue",
      label: t("qr_code__style__cornflower"),
      dark: "#5a7fd4",
      light: "#fff",
    },
    {
      id: "peach",
      label: t("qr_code__style__peach"),
      dark: "#EC8662",
      light: "#fff",
    },
    {
      id: "sand",
      label: t("qr_code__style__sand"),
      dark: "#F9F7F4",
      light: "#2D2D2D",
    },
  ];

  return (
    <div className="rounded-16 border-border bg-card border p-4.5">
      <Eyebrow className="text-muted-foreground mb-3">
        {t("qr_code__style__eyebrow")}
      </Eyebrow>
      <div className="grid grid-cols-4 gap-2.5">
        {styles.map((s) => (
          <StyleOption
            key={s.id}
            label={s.label}
            dark={s.dark}
            light={s.light}
            active={selected === s.id}
            onClick={() => setSelected(s.id)}
          />
        ))}
      </div>
      <label className="type-caption text-muted-foreground mt-3.5 flex cursor-pointer items-center gap-2">
        <span
          className={cn(
            "relative inline-block h-5 w-8.5 rounded-full transition-colors",
            showLogo ? "bg-primary shadow-input" : "bg-border",
          )}
          onClick={() => setShowLogo(!showLogo)}
        >
          <span
            className={cn(
              "bg-card absolute top-0.5 size-4 rounded-full shadow-sm transition-all",
              showLogo ? "left-4" : "left-0.5",
            )}
          />
        </span>
        {t("qr_code__style__include_logo")}
      </label>
    </div>
  );
};
