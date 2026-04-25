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
  <div className="rounded-20 border-border bg-card flex flex-col overflow-hidden border">
    <div
      className="relative flex h-45 items-center justify-center p-5"
      style={{ background: gradient }}
    >
      <p
        className="text-center font-serif text-[1.625rem] leading-tight font-semibold italic"
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
        <p className="type-h4 font-serif font-semibold">{name}</p>
        <p className="type-body-large text-primary font-serif font-semibold">
          &euro;{price}
        </p>
      </div>
      <p className="type-caption text-muted-foreground tracking-wider">
        {subtitle} &middot; Ships in {eta}
      </p>
      <p className="type-body-small text-foreground mt-1.5 leading-relaxed">
        {tagline}
      </p>
      <div className="mt-auto flex gap-2 pt-3.5">
        <Button
          size="sm"
          className="bg-foreground text-background hover:bg-foreground/90 flex-1 rounded-full"
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
    className="type-overline absolute top-3 left-3 rounded-full px-2.5 py-1 tracking-[1.5px]"
    style={{
      background: "rgba(0,0,0,0.2)",
      color: dark ? "#fff" : "rgba(0,0,0,0.7)",
    }}
  >
    {label}
  </span>
);
