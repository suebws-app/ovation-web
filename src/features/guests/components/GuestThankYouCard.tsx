import { Book } from "@ovation/icons/Book";

export const GuestThankYouCard = () => {
  return (
    <div className="rounded-20 from-primary to-primary/80 text-primary-foreground tablet:p-10 relative overflow-hidden bg-gradient-to-br p-8">
      <div className="bg-destructive/30 absolute -right-10 -bottom-10 size-55 rounded-full" />
      <div className="relative">
        <span className="type-overline text-primary-foreground/75">
          Thank-you notes
        </span>
        <h3 className="type-h2 mt-2.5 font-serif tracking-tight">
          47 guests are waiting
          <br />
          for a <span className="italic">thank-you</span>.
        </h3>
        <p className="type-body-small mt-2.5 max-w-sm leading-relaxed opacity-90">
          Pre-addressed postcards with each guest&apos;s own photo and a quote
          they said. We print, stamp, and ship.
        </p>
        <button
          type="button"
          className="bg-card type-body-small text-primary mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full px-4.5 py-3 font-bold shadow-lg"
        >
          <Book width={14} height={14} />
          Review the batch
        </button>
        <div className="type-caption mt-4.5 flex items-center gap-2 opacity-75">
          <span className="bg-primary-foreground inline-block size-1.5 rounded-full" />
          &euro;39 for 47 cards &middot; ships in 1&ndash;2 weeks
        </div>
      </div>
    </div>
  );
};
