"use client";

import { Button } from "@ovation/ui/components/Button";

export const OrderCtaStrip = () => (
  <div className="rounded-16 border-destructive/30 from-destructive/10 to-accent/10 tablet:flex-row tablet:items-center tablet:gap-5 tablet:p-6 flex flex-col gap-4 border bg-gradient-to-br p-5">
    <div className="flex-1">
      <p className="type-overline text-destructive tracking-[2px]">
        Want it on paper?
      </p>
      <p className="tablet:text-[1.625rem] mt-1.5 font-serif text-[1.375rem] leading-snug font-semibold tracking-tight">
        Letterpress QR cards &mdash;{" "}
        <span className="text-destructive italic">from &euro;1.89 each.</span>
      </p>
      <p className="type-body-small text-muted-foreground mt-1.5">
        Hand-printed in Lisbon. Ships to Girona in 5&ndash;7 days.
      </p>
    </div>
    <Button
      size="lg"
      className="shadow-primary/40 tablet:w-auto w-full rounded-full shadow-md"
    >
      Order cards
    </Button>
  </div>
);
