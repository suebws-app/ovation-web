import { Logo } from "@ovation/ui/components/Logo";
import { Kicker } from "@ovation/ui/components/Kicker";
import { FeaturePill } from "./FeaturePill";
import { WaitlistSection } from "./WaitlistSection";
import { UnlockSection } from "./UnlockSection";

export const ComingSoonPage = () => (
  <main className="bg-warm-cream relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16">
    <div
      className="bg-primary/20 pointer-events-none absolute -top-30 -left-30 size-100 rounded-full blur-3xl"
      aria-hidden="true"
    />
    <div
      className="bg-destructive/15 pointer-events-none absolute -right-20 -bottom-30 size-100 rounded-full blur-3xl"
      aria-hidden="true"
    />
    <div
      className="bg-secondary/15 pointer-events-none absolute top-1/3 -right-10 size-75 rounded-full blur-3xl"
      aria-hidden="true"
    />

    <div className="relative w-full max-w-xl">
      <div className="mb-10 flex justify-center">
        <Logo />
      </div>

      <div className="mb-6 flex justify-center">
        <Kicker className="text-destructive">Coming soon</Kicker>
      </div>

      <h1 className="type-h0 mb-4 text-center leading-none tracking-tighter">
        <span className="text-foreground block">Your wedding,</span>
        <span className="text-primary block italic">in their voices.</span>
      </h1>

      <p className="type-body text-muted-foreground mb-8 text-center leading-relaxed">
        Ovation is a keepsake app for the people you love most. Guests scan a QR
        code and leave a voice message and photo. You open one every morning —
        for as long as you&rsquo;d like.
      </p>

      <div className="mb-10 flex flex-col gap-2.5">
        <FeaturePill text="Guests scan a QR code — no app to download" />
        <FeaturePill text="One message every morning for 30 days" />
        <FeaturePill text="Auto-transcribed in 38 languages" />
      </div>

      <div className="rounded-24 border-border bg-card border p-6 shadow">
        <Kicker className="text-muted-foreground mb-4">
          Join the waitlist
        </Kicker>
        <WaitlistSection />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="bg-border h-px flex-1" />
        <span className="type-caption text-muted-foreground">or</span>
        <div className="bg-border h-px flex-1" />
      </div>

      <div className="rounded-24 border-border bg-card border p-6 shadow">
        <Kicker className="text-muted-foreground mb-4">Preview access</Kicker>
        <UnlockSection />
      </div>

      <p className="type-caption text-muted-foreground mt-10 text-center">
        &copy; {new Date().getFullYear()} Ovation. All rights reserved.
      </p>
    </div>
  </main>
);
