"use client";

import { Button } from "@ovation/ui/components/Button";

export const QRCodeMobileBar = () => (
  <div className="fixed right-0 bottom-0 left-0 flex gap-2.5 border-t border-border bg-card p-4 tablet:hidden">
    <Button variant="outline" className="rounded-full">
      PNG
    </Button>
    <Button className="flex-1 rounded-full shadow-md shadow-primary/40">
      Share QR code
    </Button>
  </div>
);
