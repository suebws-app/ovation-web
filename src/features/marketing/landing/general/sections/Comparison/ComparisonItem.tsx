import { CheckIcon } from "@ovation/icons/CheckIcon";
import { XIcon } from "@ovation/icons/XIcon";
import { cn } from "@ovation/ui/utils/cn";

type ComparisonItemProps = {
  label: string;
  isPositive: boolean;
};

export const ComparisonItem = ({ label, isPositive }: ComparisonItemProps) => (
  <li className="flex items-start gap-3">
    <span
      className={cn(
        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
        isPositive
          ? "bg-success/15 text-success"
          : "bg-destructive/15 text-destructive",
      )}
    >
      {isPositive ? (
        <CheckIcon className="size-3" aria-hidden />
      ) : (
        <XIcon className="size-3" aria-hidden />
      )}
    </span>
    <span className="text-foreground type-body">{label}</span>
  </li>
);
