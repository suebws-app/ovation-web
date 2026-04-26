"use client";

import { useTranslations } from "next-intl";
import { Play } from "@ovation/icons/Play";
import { Check } from "@ovation/icons/Check";
import { WaveformBar } from "./WaveformBar";

const WAVE_HEIGHTS = [
  18, 28, 14, 36, 22, 40, 16, 30, 44, 20, 34, 12, 38, 24, 42, 18, 32, 26, 44,
  14, 36, 20, 40, 28, 16, 38, 22, 44, 18, 30, 12, 34, 26, 42, 20, 38, 16, 32,
  28, 44, 14, 36, 22, 18,
];

export const HeroShowpiece = () => {
  const t = useTranslations();

  return (
    <div className="relative h-155 w-full">
      <div className="bg-card border-border absolute top-8 left-4 z-[1] w-48 rotate-[-9deg] overflow-hidden rounded-2xl border shadow-xl">
        <div className="from-muted to-muted-foreground/20 relative flex h-36 items-center justify-center bg-gradient-to-br">
          <span className="text-foreground/70 font-serif text-6xl font-semibold italic">
            M
          </span>
        </div>
        <div className="bg-card p-3">
          <p className="text-muted-foreground text-xs font-medium">
            {t("marketing__showpiece__caption_margot")}
          </p>
        </div>
      </div>

      <div className="bg-card border-border absolute top-4 left-44 z-[4] flex rotate-[4deg] items-center gap-2 rounded-full border px-3 py-2 shadow-lg">
        <span className="bg-secondary text-secondary-foreground flex h-5 w-5 items-center justify-center rounded-full">
          <Check />
        </span>
        <div>
          <p className="text-foreground text-xs leading-none font-semibold">
            {t("marketing__showpiece__just_arrived")}
          </p>
          <p className="text-muted-foreground type-overline mt-0.5">
            {t("marketing__showpiece__caption_abuela")}
          </p>
        </div>
      </div>

      <div className="bg-card border-border absolute top-28 left-22 z-[3] w-110 rounded-2xl border p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="from-destructive to-destructive/60 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br">
            <span className="text-primary-foreground font-serif text-base font-semibold">
              MD
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground text-sm leading-tight font-semibold">
              {t("marketing__showpiece__person_name")}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {t("marketing__showpiece__person_role")}
            </p>
          </div>
        </div>

        <blockquote className="text-foreground/80 mt-4 font-serif text-sm leading-relaxed italic">
          {t("marketing__showpiece__quote")}
        </blockquote>

        <div className="mt-4 flex items-center gap-3">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full shadow-md transition">
            <Play width={14} height={14} />
          </button>
          <div className="flex h-11 flex-1 items-end gap-px">
            {WAVE_HEIGHTS.map((h, i) => (
              <WaveformBar key={i} height={h} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border-border absolute right-4 bottom-10 z-[2] w-44 rotate-[7deg] overflow-hidden rounded-2xl border shadow-xl">
        <div className="from-primary to-primary/60 relative flex h-32 items-center justify-center bg-gradient-to-br">
          <span className="text-primary-foreground/80 font-serif text-5xl font-semibold italic">
            J
          </span>
        </div>
        <div className="bg-card p-3">
          <p className="text-muted-foreground text-xs font-medium">
            {t("marketing__showpiece__caption_joan")}
          </p>
        </div>
      </div>
    </div>
  );
};
