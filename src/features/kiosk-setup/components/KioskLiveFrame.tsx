import { Mic } from "@ovation/icons/Mic";
import { Lock } from "@ovation/icons/Lock";
import { Wifi } from "@ovation/icons/Wifi";
import { Battery } from "@ovation/icons/Battery";
import { Finger } from "@ovation/icons/Finger";
import { KioskLiveLanguagePill } from "./KioskLiveLanguagePill";

export const KioskLiveFrame = () => {
  return (
    <div
      className="relative flex size-full flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 30%, oklch(0.72 0.14 255 / 0.25), transparent 50%), radial-gradient(circle at 80% 75%, oklch(0.72 0.14 40 / 0.30), transparent 50%), radial-gradient(circle at 60% 20%, oklch(0.72 0.14 75 / 0.20), transparent 45%), linear-gradient(180deg, #F9F7F4, #EEE6DC)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 6px, rgba(0,0,0,0.02) 6px 7px)",
        }}
      />

      <div className="type-caption text-muted-foreground relative z-10 flex items-center justify-between px-7 py-5">
        <div className="flex items-center gap-2.5">
          <div className="rounded-6 bg-primary type-caption text-primary-foreground flex size-5.5 items-center justify-center font-serif font-bold">
            O
          </div>
          <span className="text-foreground font-semibold">Kiosk mode</span>
          <span className="opacity-50">&middot;</span>
          <span className="inline-flex items-center gap-1">
            <Lock width={11} height={11} /> Locked
          </span>
        </div>
        <div className="flex items-center gap-3.5">
          <span className="inline-flex items-center gap-1.5">
            <Wifi width={12} height={12} />
            Mas de la Calma WiFi
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Battery width={12} height={12} />
            84%
          </span>
          <span>10:42 PM</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-20 text-center">
        <div className="type-overline text-primary tracking-widest">
          You&apos;re at the wedding of
        </div>
        <h1
          className="mt-3.5 font-serif leading-none font-semibold tracking-tight"
          style={{ fontSize: 96 }}
        >
          Lena <span className="text-primary italic">&amp;</span> Tom&aacute;s
        </h1>
        <div className="type-body-small text-muted-foreground mt-2.5 font-semibold tracking-widest uppercase">
          14 June 2026 &middot; Cascais, Portugal
        </div>

        <p className="mt-9 max-w-xl font-serif text-2xl leading-snug italic">
          &ldquo;Hola! Bienvenue. Leave us a message &mdash; a story, a song, a
          bad dance move. We&apos;ll cherish it.&rdquo;
        </p>

        <button
          type="button"
          className="border-card bg-destructive relative mt-13 flex size-35 cursor-pointer items-center justify-center rounded-full border-8 shadow-lg"
          style={{
            boxShadow:
              "0 20px 50px oklch(0.72 0.14 40 / 0.45), 0 0 0 1px oklch(0.72 0.14 40 / 0.18)",
          }}
        >
          <div className="border-destructive/40 pointer-events-none absolute -inset-10 rounded-full border-2 opacity-50" />
          <div className="border-destructive/25 pointer-events-none absolute -inset-18 rounded-full border opacity-35" />
          <Mic width={54} height={54} className="text-card" strokeWidth={1.8} />
        </button>
        <div className="type-body mt-5 font-semibold">
          Tap to leave a message
        </div>
        <div className="type-body-small text-muted-foreground mt-1">
          ~60 seconds &middot; audio &middot; photo optional
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between px-7 py-5.5">
        <div className="flex gap-2">
          <KioskLiveLanguagePill
            flag="\ud83c\uddf5\ud83c\uddf9"
            label="Portugu\u00eas"
            active
          />
          <KioskLiveLanguagePill
            flag="\ud83c\uddec\ud83c\udde7"
            label="English"
          />
          <KioskLiveLanguagePill
            flag="\ud83c\uddea\ud83c\uddf8"
            label="Espa\u00f1ol"
          />
          <KioskLiveLanguagePill
            flag="\ud83c\uddeb\ud83c\uddf7"
            label="Fran\u00e7ais"
          />
        </div>
        <div className="type-caption text-muted-foreground flex items-center gap-2">
          <Finger width={13} height={13} />
          Three-finger press to exit kiosk
        </div>
      </div>
    </div>
  );
};
