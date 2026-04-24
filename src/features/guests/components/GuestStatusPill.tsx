import { cn } from "@ovation/ui/utils/cn";
import { Check } from "@ovation/icons/Check";
import { Mic } from "@ovation/icons/Mic";
import { Hourglass } from "@ovation/icons/Hourglass";

type GuestStatusPillProps = {
  contributed: boolean;
  thanked: boolean;
  nudged?: string;
};

export const GuestStatusPill = ({
  contributed,
  thanked,
  nudged,
}: GuestStatusPillProps) => {
  if (contributed && thanked) {
    return (
      <PillBase className="bg-secondary/20 text-secondary-foreground">
        <Check width={11} height={11} />
        Contributed &middot; Thanked
      </PillBase>
    );
  }

  if (contributed) {
    return (
      <PillBase className="bg-primary/15 text-primary">
        <Mic width={11} height={11} />
        Contributed
      </PillBase>
    );
  }

  if (nudged?.startsWith("Nudge sent")) {
    return (
      <PillBase className="bg-accent/25 text-accent-foreground">
        <Hourglass width={11} height={11} />
        Nudged
      </PillBase>
    );
  }

  return (
    <PillBase className="bg-muted text-muted-foreground">
      <Hourglass width={11} height={11} />
      Awaiting
    </PillBase>
  );
};

const PillBase = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 type-caption font-bold tracking-wide",
      className,
    )}
  >
    {children}
  </span>
);
