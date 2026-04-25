"use client";

import { useTranslations } from "next-intl";

const LOGOS = [
  "The Knot",
  "Vogue Weddings",
  "Condé Nast",
  "Bruid&Bruidegom",
  "Hola! Novias",
  "Martha Stewart",
];

const LogoName = ({ name }: { name: string }) => (
  <span className="text-foreground font-serif text-[22px] font-medium tracking-tight">
    {name}
  </span>
);

export const LogoBar = () => {
  const t = useTranslations();

  return (
    <div className="border-border border-t pt-10">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-20">
        <p className="text-muted-foreground mb-6 text-center text-[11px] font-bold tracking-[2.2px] uppercase">
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
