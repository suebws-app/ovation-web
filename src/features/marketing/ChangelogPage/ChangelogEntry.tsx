import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@ovation/icons/ArrowRightIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { Badge } from "@ovation/ui/components/Badge";
import { Button } from "@ovation/ui/components/Button";
import { Link } from "@/i18n/navigation";
import type { ChangelogEntry as ChangelogEntryType } from "./changelogEntries";

type ChangelogEntryProps = {
  entry: ChangelogEntryType;
};

export const ChangelogEntry = ({ entry }: ChangelogEntryProps) => {
  const t = useTranslations();

  return (
    <article
      id={entry.slug}
      className="border-border tablet:pt-16 border-t pt-10 first:border-t-0 first:pt-0"
    >
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary">{t(entry.categoryKey)}</Badge>
        <time className="text-muted-foreground type-caption">
          {t(entry.dateKey)}
        </time>
      </div>

      <h2 className="landing-h3 text-foreground mt-4">{t(entry.titleKey)}</h2>

      <p className="text-muted-foreground type-body-large mt-4 max-w-prose leading-relaxed">
        {t(entry.descriptionKey)}
      </p>

      {entry.image && (
        <div className="rounded-24 border-border relative mt-8 aspect-2770/1582 w-full overflow-hidden border">
          <Image
            src={entry.image.src}
            alt={t(entry.image.altKey)}
            fill
            sizes="(min-width: 1024px) 800px, 90vw"
            className="object-cover"
          />
        </div>
      )}

      {entry.highlightKeys.length > 0 && (
        <ul className="tablet:grid-cols-2 mt-8 grid grid-cols-1 gap-3">
          {entry.highlightKeys.map((key) => (
            <li key={key} className="flex items-start gap-3">
              <span className="bg-primary/15 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                <CheckIcon className="size-4" />
              </span>
              <span className="text-foreground type-body leading-relaxed">
                {t(key)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {entry.cta && (
        <Button variant="pillPrimary" size="pill" className="mt-8" asChild>
          <Link href={entry.cta.href}>
            {t(entry.cta.labelKey)}
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      )}
    </article>
  );
};
