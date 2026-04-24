import { cn } from "@ovation/ui/utils/cn";

type KioskLanguageChipProps = {
  flag: string;
  label: string;
  isMain?: boolean;
};

export const KioskLanguageChip = ({
  flag,
  label,
  isMain,
}: KioskLanguageChipProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 type-body-small font-semibold",
      isMain
        ? "bg-primary/10 text-primary"
        : "border border-border bg-card text-foreground",
    )}
  >
    <span className="type-body-small">{flag}</span>
    {label}
    {isMain && (
      <span className="ml-0.5 rounded-4 bg-primary px-1.5 py-0.5 type-overline text-primary-foreground">
        MAIN
      </span>
    )}
    {!isMain && (
      <span className="cursor-pointer text-muted-foreground">&times;</span>
    )}
  </span>
);
