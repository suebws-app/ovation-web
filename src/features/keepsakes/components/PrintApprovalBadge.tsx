import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import type { PrintApprovalStatus } from "@/lib/api/types";

type PrintApprovalBadgeProps = {
  status: PrintApprovalStatus;
};

const TONE_CLASSES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  rejected: "bg-destructive/15 text-destructive",
};

const STATUS_LABEL_KEY: Record<string, string> = {
  pending: "orders__print_approval__pending",
  approved: "orders__print_approval__approved",
  rejected: "orders__print_approval__rejected",
};

export const PrintApprovalBadge = ({ status }: PrintApprovalBadgeProps) => {
  const t = useTranslations();
  if (status === "not_required") return null;

  const tone = TONE_CLASSES[status] ?? "bg-muted text-muted-foreground";
  const labelKey = STATUS_LABEL_KEY[status];
  const label = labelKey ? t(labelKey) : status;

  return (
    <span
      className={cn(
        "type-caption inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold tracking-wider",
        tone,
      )}
    >
      {label}
    </span>
  );
};
