"use client";

import { designFor } from "@/features/keepsakes/designTokens";

type CartLineItemArtProps = {
  kind: string;
};

export const CartLineItemArt = ({ kind }: CartLineItemArtProps) => {
  const design = designFor(kind);
  const dark = Boolean(design.dark);
  return (
    <div
      className="rounded-12 tablet:size-22.5 relative size-16 overflow-hidden"
      style={{ background: design.gradient }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center font-serif italic font-semibold"
        style={{
          color: dark ? "#fff" : "var(--foreground)",
          textShadow: dark ? "0 2px 6px rgba(0,0,0,0.25)" : "none",
        }}
      >
        <span className="type-h2">O</span>
      </div>
    </div>
  );
};
