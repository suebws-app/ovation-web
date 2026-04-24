import { cn } from "@ovation/ui/utils/cn";

type SettingsRowProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  last?: boolean;
  warn?: boolean;
  children: React.ReactNode;
};

export const SettingsRow = ({
  title,
  description,
  last,
  warn,
  children,
}: SettingsRowProps) => (
  <div
    className={cn(
      "grid grid-cols-[1fr_auto] items-start gap-10 py-5.5",
      !last && "border-b border-border",
    )}
  >
    <div>
      <div
        className={cn(
          "type-body-small font-semibold",
          warn && "text-destructive",
        )}
      >
        {title}
      </div>
      {description && (
        <div className="mt-1 max-w-lg type-body-small text-muted-foreground leading-relaxed">
          {description}
        </div>
      )}
    </div>
    <div className="flex shrink-0 items-center gap-3">{children}</div>
  </div>
);
