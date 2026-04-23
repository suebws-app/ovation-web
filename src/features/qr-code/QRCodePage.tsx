"use client";

import { Button } from "@ovation/ui/components/Button";
import { QRStage } from "./components/QRStage";
import { UrlCard } from "./components/UrlCard";
import { StylePicker } from "./components/StylePicker";
import { DownloadCard } from "./components/DownloadCard";
import { ShareCard } from "./components/ShareCard";
import { QRStatsCard } from "./components/QRStatsCard";
import { OrderCtaStrip } from "./components/OrderCtaStrip";

export const QRCodePage = () => {
  return (
    <div className="mx-auto min-w-0">
      <div className="flex flex-col gap-5 desktop:flex-row desktop:items-end desktop:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-[2.125rem] font-semibold leading-tight tracking-tight tablet:text-[2.75rem]">
            Your <span className="italic text-primary">QR code.</span>
          </h1>
          <p className="mt-2 max-w-130 type-body-small leading-relaxed text-muted-foreground">
            Any guest who scans this lands directly on your welcome screen.
            Download, share, whatever you like — napkins included.
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

      <div className="mt-6 grid gap-4 desktop:grid-cols-[1fr_420px]">
        <QRStage />
        <div className="flex flex-col gap-4">
          <UrlCard />
          <StylePicker />
        </div>
      </div>

      <div className="mt-4 grid gap-4 tablet:grid-cols-2">
        <DownloadCard />
        <ShareCard />
      </div>

      <div className="mt-4">
        <QRStatsCard />
      </div>

      <div className="mt-4">
        <OrderCtaStrip />
      </div>

      <div className="mt-6 hidden justify-end gap-2.5 tablet:flex">
        <Button variant="outline" className="rounded-full">
          Print A4 sheet
        </Button>
        <Button variant="outline" className="rounded-full">
          Copy embed code
        </Button>
        <Button
          variant="ghost"
          className="rounded-full bg-foreground text-background hover:bg-foreground/90"
        >
          Open guest view
        </Button>
      </div>

      <div className="fixed right-0 bottom-0 left-0 flex gap-2.5 border-t border-border bg-card p-4 tablet:hidden">
        <Button variant="outline" className="rounded-full">
          PNG
        </Button>
        <Button className="flex-1 rounded-full shadow-md shadow-primary/40">
          Share QR code
        </Button>
      </div>
    </div>
  );
};
