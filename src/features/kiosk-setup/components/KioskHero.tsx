"use client";

import { Button } from "@ovation/ui/components/Button";
import { Play } from "@ovation/icons/Play";
import { QrCode } from "@ovation/icons/QrCode";

export const KioskHero = () => {
  return (
    <div className="relative overflow-hidden rounded-20 bg-card p-8 tablet:p-10 desktop:p-12">
      <div className="absolute -right-10 -top-10 size-70 rounded-full bg-primary/10" />
      <div className="relative grid items-end gap-10 desktop:grid-cols-[1fr_auto]">
        <div>
          <span className="type-overline text-primary">Kiosk mode</span>
          <h1 className="mt-2.5 font-serif type-display tracking-tight">
            Turn any phone or tablet into a{" "}
            <span className="italic text-primary">guestbook</span>.
          </h1>
          <p className="mt-3.5 max-w-xl type-body text-muted-foreground">
            Set a device on a stand at the venue. Guests tap, record, and done
            &mdash; no app, no scanning. Locked down so nobody can wander off
            into your photos.
          </p>
        </div>

        <KioskStatusCard />
      </div>
    </div>
  );
};

const KioskStatusCard = () => (
  <div className="w-85 rounded-20 border border-border bg-card p-5.5 shadow">
    <div className="flex items-center gap-2.5 type-overline text-muted-foreground">
      <span className="size-2 rounded-full bg-muted-foreground/50" />
      Currently offline
    </div>
    <p className="mt-2.5 font-serif type-h3 font-semibold leading-snug tracking-tight">
      Start the kiosk from the device you&apos;ll use at the venue.
    </p>
    <Button className="mt-4 w-full rounded-16 shadow-lg">
      <Play width={14} height={14} />
      Start kiosk on this device
    </Button>
    <div className="mt-3.5 flex items-center gap-2.5 rounded-10 bg-background p-3 type-caption text-muted-foreground leading-relaxed">
      <QrCode width={20} height={20} className="shrink-0 text-primary" />
      Or scan this on the device you&apos;ll use &mdash; it&apos;ll open kiosk
      instantly.
    </div>
  </div>
);
