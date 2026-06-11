import type { ReactNode } from "react";
import { cn } from "@ovation/ui/utils/cn";
import { CheckIcon } from "@ovation/icons/CheckIcon";

type ReviewItemProps = {
  icon: ReactNode;
  iconClassName: string;
  title: string;
  meta?: string;
  preview?: ReactNode;
};

export const ReviewItem = ({
  icon,
  iconClassName,
  title,
  meta,
  preview,
}: ReviewItemProps) => (
  <div className="bg-card border-border rounded-16 flex flex-col gap-3 border p-4">
    <div className="flex items-center gap-3.5">
      <div
        className={cn(
          "rounded-12 text-primary-foreground flex size-10 shrink-0 items-center justify-center",
          iconClassName,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="type-h4 leading-tight font-semibold">{title}</h3>
        {meta && (
          <p className="type-body-small text-muted-foreground mt-0.5 truncate">
            {meta}
          </p>
        )}
      </div>
      <CheckIcon width={18} height={18} className="text-secondary shrink-0" />
    </div>
    {preview}
  </div>
);
