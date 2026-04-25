"use client";

import { Button } from "@ovation/ui/components/Button";

export const QRCodeHeader = () => (
  <div className="flex flex-col gap-5 desktop:flex-row desktop:items-end desktop:justify-between">
    <div className="min-w-0">
      <h1 className="font-serif text-[2.125rem] font-semibold leading-tight tracking-tight tablet:text-[2.75rem]">
        Your <span className="italic text-primary">QR code.</span>
      </h1>
      <p className="mt-2 max-w-130 type-body-small leading-relaxed text-muted-foreground">
        Any guest who scans this lands directly on your welcome screen.
        Download, share, whatever you like &mdash; napkins included.
      </p>
    </div>
    <div className="hidden shrink-0 gap-2 desktop:flex">
      <Button variant="outline" className="whitespace-nowrap rounded-full">
        Preview guest view
      </Button>
      <Button className="whitespace-nowrap rounded-full shadow-md shadow-primary/40">
        Order printed cards
      </Button>
    </div>
  </div>
);
