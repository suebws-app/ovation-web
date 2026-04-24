import { cn } from "@ovation/ui/utils/cn";

type GuestStatCardProps = {
  value: number;
  label: string;
  sub: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone: "primary" | "destructive" | "accent" | "muted";
};

const toneBg: Record<GuestStatCardProps["tone"], string> = {
  primary: "bg-primary/15",
  destructive: "bg-destructive/15",
  accent: "bg-accent/15",
  muted: "bg-muted",
};

const toneText: Record<GuestStatCardProps["tone"], string> = {
  primary: "text-primary",
  destructive: "text-destructive",
  accent: "text-accent-foreground",
  muted: "text-muted-foreground",
};

export const GuestStatCard = ({
  value,
  label,
  sub,
  icon: Icon,
  tone,
}: GuestStatCardProps) => {
  return (
    <div className="relative rounded-16 border border-border bg-card p-5">
      <div
        className={cn(
          "absolute right-4.5 top-4.5 flex size-8 items-center justify-center rounded-10",
          toneBg[tone],
        )}
      >
        <Icon width={15} height={15} className={toneText[tone]} />
      </div>
      <div className="font-serif text-4xl font-semibold leading-none tracking-tight">
        {value}
      </div>
      <div className="mt-2 type-body-small font-semibold">{label}</div>
      <div className="mt-0.5 type-caption text-muted-foreground">{sub}</div>
    </div>
  );
};
