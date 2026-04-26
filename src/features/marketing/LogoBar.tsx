"use client";

import { useTranslations } from "next-intl";
import { LogoName } from "./LogoName";

const LOGOS = [
  "The Knot",
  "Vogue Weddings",
  "Condé Nast",
  "Bruid&Bruidegom",
  "Hola! Novias",
  "Martha Stewart",
];

export const LogoBar = () => {
  const t = useTranslations();

  return (
    <div className="border-border border-t pt-10">
      <div className="mx-auto max-w-310 px-6 lg:px-20">
        <p className="text-muted-foreground type-overline mb-6 text-center font-bold tracking-[2.2px] uppercase">
          {t("marketing__logos__title")}
        </p>
        <div className="flex items-center justify-between opacity-50">
          {LOGOS.map((name) => (
            <LogoName key={name} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
};
