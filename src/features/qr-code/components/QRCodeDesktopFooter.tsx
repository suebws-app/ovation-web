"use client";

import { Button } from "@ovation/ui/components/Button";

export const QRCodeDesktopFooter = () => (
  <div className="tablet:flex mt-6 hidden justify-end gap-2.5">
    <Button variant="outline" className="rounded-full">
      Print A4 sheet
    </Button>
    <Button variant="outline" className="rounded-full">
      Copy embed code
    </Button>
    <Button
      variant="ghost"
      className="bg-foreground text-background hover:bg-foreground/90 rounded-full"
    >
      Open guest view
    </Button>
  </div>
);
