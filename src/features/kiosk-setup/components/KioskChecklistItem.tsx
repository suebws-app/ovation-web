import { Check } from "@ovation/icons/Check";
import { Button } from "@ovation/ui/components/Button";
import { cn } from "@ovation/ui/utils/cn";

type KioskChecklistItemProps = {
  title: string;
  description: string;
  done: boolean;
  cta?: string;
};

export const KioskChecklistItem = ({
  title,
  description,
  done,
  cta,
}: KioskChecklistItemProps) => (
  <div
    className={cn(
      "flex items-start gap-3 rounded-16 border bg-card p-4",
      done ? "border-secondary/40" : "border-border",
    )}
  >
    <div
      className={cn(
        "mt-0.5 flex size-6.5 shrink-0 items-center justify-center rounded-full",
        done ? "bg-secondary" : "border-2 border-border bg-card",
      )}
    >
      {done && <Check width={14} height={14} className="text-background" />}
    </div>
    <div className="min-w-0 flex-1">
      <div
        className={cn(
          "type-body-small font-semibold",
          done && "line-through decoration-foreground/25",
        )}
      >
        {title}
      </div>
      <div className="mt-0.5 type-caption text-muted-foreground leading-snug">
        {description}
      </div>
      {cta && !done && (
        <Button size="sm" className="mt-2.5 rounded-full" >
          {cta}
        </Button>
      )}
    </div>
  </div>
);
