import { Button } from "@ovation/ui/components/Button";
import { HeartIcon } from "@ovation/icons/HeartIcon";
import { SparkleIcon } from "@ovation/icons/SparkleIcon";
import { Link } from "@/i18n/navigation";
import { appRoutes } from "@/lib/routes";
import { daysUntil, formatLongDate } from "../utils";

type CountdownHeroProps = {
  partners: string;
  venue: string | null;
  city: string | null;
  date: string | null;
  daysLabel: string;
  askAiLabel: string;
  viewTimelineLabel: string;
};

export const CountdownHero = ({
  partners,
  venue,
  city,
  date,
  daysLabel,
  askAiLabel,
  viewTimelineLabel,
}: CountdownHeroProps) => {
  const days = date ? daysUntil(date) : null;
  const heading = [partners, venue].filter(Boolean).join(" · ");
  const subline = [date ? formatLongDate(date) : null, city]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-20 bg-primary text-primary-foreground tablet:p-8 relative overflow-hidden p-6">
      <HeartIcon className="pointer-events-none absolute -top-8 -right-8 size-50 opacity-10" />
      <p className="type-overline text-primary-foreground/80">{heading}</p>
      <div className="mt-4 flex items-baseline gap-4">
        <span className="type-display font-serif leading-none">
          {days ?? "—"}
        </span>
        <span className="type-h2 text-primary-foreground/85 font-serif italic">
          {daysLabel}
        </span>
      </div>
      {subline ? (
        <p className="type-body-small text-primary-foreground/70 mt-3">
          {subline}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-2.5">
        <Button asChild size="sm" variant="secondary">
          <Link href={appRoutes.app.weddingPlanner.assistant}>
            <SparkleIcon width={15} height={15} />
            {askAiLabel}
          </Link>
        </Button>
        <Button asChild size="sm" variant="pillGhost">
          <Link href={appRoutes.app.weddingPlanner.timeline}>
            {viewTimelineLabel}
          </Link>
        </Button>
      </div>
    </div>
  );
};
