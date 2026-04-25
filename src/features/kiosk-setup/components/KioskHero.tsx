"use client";

import { Button } from "@ovation/ui/components/Button";
import { Play } from "@ovation/icons/Play";
import { QrCode } from "@ovation/icons/QrCode";

export const KioskHero = () => {
  return (
    <div className="rounded-20 bg-card tablet:p-10 desktop:p-12 relative overflow-hidden p-8">
      <div className="bg-primary/10 absolute -top-10 -right-10 size-70 rounded-full" />
      <div className="desktop:grid-cols-[1fr_auto] relative grid items-end gap-10">
        <div>
          <span className="type-overline text-primary">Kiosk mode</span>
          <h1 className="type-display mt-2.5 font-serif tracking-tight">
            Turn any phone or tablet into a{" "}
            <span className="text-primary italic">guestbook</span>.
          </h1>
          <p className="type-body text-muted-foreground mt-3.5 max-w-xl">
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
  <div className="rounded-20 border-border bg-card w-85 border p-5.5 shadow">
    <div className="type-overline text-muted-foreground flex items-center gap-2.5">
      <span className="bg-muted-foreground/50 size-2 rounded-full" />
      Currently offline
    </div>
    <p className="type-h3 mt-2.5 font-serif leading-snug font-semibold tracking-tight">
      Start the kiosk from the device you&apos;ll use at the venue.
    </p>
    <Button className="rounded-16 mt-4 w-full shadow-lg">
      <Play width={14} height={14} />
      Start kiosk on this device
    </Button>
    <div className="rounded-10 bg-background type-caption text-muted-foreground mt-3.5 flex items-center gap-2.5 p-3 leading-relaxed">
      <QrCode width={20} height={20} className="text-primary shrink-0" />
      Or scan this on the device you&apos;ll use &mdash; it&apos;ll open kiosk
      instantly.
    </div>
  </div>
);
