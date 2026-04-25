"use client";

import { Button } from "@ovation/ui/components/Button";

export const QRCodeHeader = () => (
  <div className="desktop:flex-row desktop:items-end desktop:justify-between flex flex-col gap-5">
    <div className="min-w-0">
      <h1 className="tablet:text-[2.75rem] font-serif text-[2.125rem] leading-tight font-semibold tracking-tight">
        Your <span className="text-primary italic">QR code.</span>
      </h1>
      <p className="type-body-small text-muted-foreground mt-2 max-w-130 leading-relaxed">
        Any guest who scans this lands directly on your welcome screen.
        Download, share, whatever you like &mdash; napkins included.
      </p>
    </div>
    <div className="desktop:flex hidden shrink-0 gap-2">
      <Button variant="outline" className="rounded-full whitespace-nowrap">
        Preview guest view
      </Button>
      <Button className="shadow-primary/40 rounded-full whitespace-nowrap shadow-md">
        Order printed cards
      </Button>
    </div>
  </div>
);
