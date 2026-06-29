import { cn } from "@ovation/ui/utils/cn";

export type StatTone = "primary" | "accent" | "muted";

type AnalyticsStatCardProps = {
  value: string;
  label: string;
  sub?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone: StatTone;
};

const toneBg: Record<StatTone, string> = {
  primary: "bg-primary/15",
  accent: "bg-accent/15",
  muted: "bg-muted",
};

const toneText: Record<StatTone, string> = {
  primary: "text-primary",
  accent: "text-accent-foreground",
  muted: "text-muted-foreground",
};

export const AnalyticsStatCard = ({
  value,
  label,
  sub,
  icon: Icon,
  tone,
}: AnalyticsStatCardProps) => (
  <div className="rounded-16 border-border bg-card relative border p-5">
    <div
      className={cn(
        "rounded-10 absolute top-4.5 right-4.5 flex size-8 items-center justify-center",
        toneBg[tone],
      )}
    >
      <Icon width={15} height={15} className={toneText[tone]} />
    </div>
    <div className="font-serif text-4xl leading-none font-semibold tracking-tight">
      {value}
    </div>
    <div className="type-body-small mt-2 font-semibold">{label}</div>
    {sub ? (
      <div className="type-caption text-muted-foreground mt-0.5">{sub}</div>
    ) : null}
  </div>
);
