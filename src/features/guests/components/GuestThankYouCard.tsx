import { Book } from "@ovation/icons/Book";

export const GuestThankYouCard = () => {
  return (
    <div className="relative overflow-hidden rounded-20 bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground tablet:p-10">
      <div className="absolute -bottom-10 -right-10 size-55 rounded-full bg-destructive/30" />
      <div className="relative">
        <span className="type-overline text-primary-foreground/75">
          Thank-you notes
        </span>
        <h3 className="mt-2.5 font-serif type-h2 tracking-tight">
          47 guests are waiting
          <br />
          for a <span className="italic">thank-you</span>.
        </h3>
        <p className="mt-2.5 max-w-sm type-body-small leading-relaxed opacity-90">
          Pre-addressed postcards with each guest&apos;s own photo and a quote
          they said. We print, stamp, and ship.
        </p>
        <button
          type="button"
          className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-card px-4.5 py-3 type-body-small font-bold text-primary shadow-lg"
        >
          <Book width={14} height={14} />
          Review the batch
        </button>
        <div className="mt-4.5 flex items-center gap-2 type-caption opacity-75">
          <span className="inline-block size-1.5 rounded-full bg-primary-foreground" />
          &euro;39 for 47 cards &middot; ships in 1&ndash;2 weeks
        </div>
      </div>
    </div>
  );
};
