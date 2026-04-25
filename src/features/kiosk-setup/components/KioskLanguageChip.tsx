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
      "type-body-small inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-semibold",
      isMain
        ? "bg-primary/10 text-primary"
        : "border-border bg-card text-foreground border",
    )}
  >
    <span className="type-body-small">{flag}</span>
    {label}
    {isMain && (
      <span className="rounded-4 bg-primary type-overline text-primary-foreground ml-0.5 px-1.5 py-0.5">
        MAIN
      </span>
    )}
    {!isMain && (
      <span className="text-muted-foreground cursor-pointer">&times;</span>
    )}
  </span>
);
