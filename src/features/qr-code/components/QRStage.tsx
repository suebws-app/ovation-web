"use client";

import { useState } from "react";
import { cn } from "@ovation/ui/utils/cn";
import { QRBlock } from "./QRBlock";

const TABS = ["Standard", "With photo", "Poster"];

type QRStageProps = {
  coupleName?: string;
  url?: string;
};

export const QRStage = ({
  coupleName = "Lena & Tomás",
  url = "lena-and-tomas",
}: QRStageProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="rounded-20 from-primary to-primary/80 tablet:p-12 relative flex flex-col items-center gap-5 overflow-hidden bg-gradient-to-br p-7">
      <div
        className="pointer-events-none absolute -top-15 -right-15 size-55 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.723 0.135 40 / 0.3), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 size-50 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.818 0.105 73.3 / 0.4), transparent 70%)",
        }}
      />

      <div className="text-primary-foreground relative text-center">
        <p className="type-overline tracking-[2px] opacity-85">
          Scan to leave a message
        </p>
        <p className="tablet:text-[1.875rem] mt-1.5 font-serif text-[1.5rem] font-medium italic">
          {coupleName}
        </p>
      </div>

      <div className="rounded-16 bg-card relative p-5 shadow-lg">
        <QRBlock size={220} />
      </div>

      <p className="type-body-small text-primary-foreground/90 relative font-mono tracking-wider">
        ovation.love/{url}
      </p>

      <div className="relative flex gap-2">
        {TABS.map((tab, i) => (
          <QRTabButton
            key={tab}
            label={tab}
            active={activeTab === i}
            onClick={() => setActiveTab(i)}
          />
        ))}
      </div>
    </div>
  );
};

const QRTabButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "type-caption cursor-pointer rounded-full px-3.5 py-1.5 font-semibold transition-colors",
      active
        ? "bg-card text-foreground"
        : "text-primary-foreground bg-white/15 hover:bg-white/25",
    )}
  >
    {label}
  </button>
);
