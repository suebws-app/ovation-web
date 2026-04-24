import { Button } from "@ovation/ui/components/Button";
import { Box } from "@ovation/icons/Box";

export const ExportHeroCard = () => (
  <div className="relative mt-8 overflow-hidden rounded-20 bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
    <div className="absolute -right-10 -top-10 size-55 rounded-full bg-destructive/30" />
    <div className="relative grid items-center gap-10 desktop:grid-cols-[1fr_auto]">
      <div>
        <span className="type-overline text-primary-foreground/85">
          One-click archive
        </span>
        <h3 className="mt-2.5 font-serif type-h2 font-semibold leading-snug">
          Download everything
          <br />
          <span className="italic">as a single .zip.</span>
        </h3>
        <p className="mt-3 max-w-md type-body-small leading-relaxed opacity-85">
          142 messages &middot; 4.2 hours of audio &middot; 63 photos &middot;
          full JSON metadata. Arrives in your email within 10 minutes.
        </p>
      </div>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-card px-6 py-3.5 type-body-small font-bold text-primary shadow-lg"
      >
        <Box width={16} height={16} />
        Request export
      </button>
    </div>
  </div>
);
