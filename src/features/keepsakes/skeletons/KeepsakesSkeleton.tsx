import { useTranslations } from "next-intl";
import { Kicker } from "@ovation/ui/components/Kicker";
import { Skeleton } from "@ovation/ui/components/Skeleton";
import { cn } from "@ovation/ui/utils/cn";
import { KeepsakesHero } from "../components/KeepsakesHero";

const cards = Array.from({ length: 6 }, (_, i) => i);

const FILTER_LABEL_KEYS = [
  "keepsakes__filter__all",
  "keepsakes__filter__printed",
  "keepsakes__filter__digital",
  "keepsakes__filter__physical",
  "keepsakes__filter__gifts",
] as const;

const StaticFilterTab = ({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) => (
  <span
    className={cn(
      "type-caption rounded-full px-3 py-1.5 font-semibold whitespace-nowrap",
      active
        ? "bg-foreground text-background"
        : "border-border bg-card text-muted-foreground border",
    )}
  >
    {label}
  </span>
);

const StaticFilterTabs = () => {
  const t = useTranslations();
  return (
    <div className="flex gap-1.5 overflow-auto">
      {FILTER_LABEL_KEYS.map((key, i) => (
        <StaticFilterTab key={key} label={t(key)} active={i === 0} />
      ))}
    </div>
  );
};

const SkeletonProductCard = () => (
  <div className="rounded-20 border-border bg-card flex flex-col overflow-hidden border">
    <Skeleton className="h-45 w-full rounded-none" />
    <div className="flex flex-1 flex-col gap-1.5 p-4.5">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-5 w-32 max-w-full" />
        <Skeleton className="h-5 w-16 shrink-0" />
      </div>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-1.5 h-4 w-full max-w-60" />
      <div className="mt-auto flex gap-2 pt-3.5">
        <Skeleton className="h-8 flex-1 rounded-full" />
        <Skeleton className="h-8 w-24 shrink-0 rounded-full" />
      </div>
    </div>
  </div>
);

export const KeepsakesSkeleton = () => {
  const t = useTranslations();
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <KeepsakesHero />
      </div>
      <div className="mt-9">
        <div className="tablet:flex-row tablet:items-end tablet:justify-between flex flex-col gap-4.5">
          <div>
            <Kicker className="text-muted-foreground">
              {t("keepsakes__collection__eyebrow")}
            </Kicker>
            <h2 className="type-h2 mt-1.5 font-semibold tracking-tight">
              {t("keepsakes__collection__title")}
            </h2>
          </div>
          <StaticFilterTabs />
        </div>
        <div className="tablet:grid-cols-2 desktop:grid-cols-3 mt-4.5 grid gap-4.5">
          {cards.map((i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
