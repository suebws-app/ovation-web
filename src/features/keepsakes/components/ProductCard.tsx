"use client";

import { Button } from "@ovation/ui/components/Button";
import { ArrowRight } from "@ovation/icons/ArrowRight";

type ProductCardProps = {
  name: string;
  price: number;
  subtitle: string;
  eta: string;
  tagline: string;
  gradient: string;
  headline: string;
  tag?: string;
  dark?: boolean;
};

export const ProductCard = ({
  name,
  price,
  subtitle,
  eta,
  tagline,
  gradient,
  headline,
  tag,
  dark = false,
}: ProductCardProps) => (
  <div className="flex flex-col overflow-hidden rounded-20 border border-border bg-card">
    <div
      className="relative flex h-45 items-center justify-center p-5"
      style={{ background: gradient }}
    >
      <p
        className="text-center font-serif text-[1.625rem] font-semibold italic leading-tight"
        style={{
          color: dark ? "#fff" : "var(--foreground)",
          textShadow: dark ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
        }}
      >
        {headline}
      </p>
      {tag && <ProductTag label={tag} dark={dark} />}
    </div>
    <div className="flex flex-1 flex-col gap-1.5 p-4.5">
      <div className="flex items-baseline justify-between">
        <p className="font-serif type-h4 font-semibold">{name}</p>
        <p className="font-serif type-body-large font-semibold text-primary">
          &euro;{price}
        </p>
      </div>
      <p className="type-caption tracking-wider text-muted-foreground">
        {subtitle} &middot; Ships in {eta}
      </p>
      <p className="mt-1.5 type-body-small leading-relaxed text-foreground">
        {tagline}
      </p>
      <div className="mt-auto flex gap-2 pt-3.5">
        <Button
          size="sm"
          className="flex-1 rounded-full bg-foreground text-background hover:bg-foreground/90"
        >
          Customise <ArrowRight width={12} height={12} />
        </Button>
        <Button variant="outline" size="sm" className="rounded-full">
          Preview
        </Button>
      </div>
    </div>
  </div>
);

const ProductTag = ({ label, dark }: { label: string; dark: boolean }) => (
  <span
    className="absolute top-3 left-3 rounded-full px-2.5 py-1 type-overline tracking-[1.5px]"
    style={{
      background: "rgba(0,0,0,0.2)",
      color: dark ? "#fff" : "rgba(0,0,0,0.7)",
    }}
  >
    {label}
  </span>
);
