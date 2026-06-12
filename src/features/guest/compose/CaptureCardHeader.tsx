import type { CSSProperties, ReactNode } from "react";
import { cn } from "@ovation/ui/utils/cn";

type CaptureCardHeaderProps = {
  icon: ReactNode;
  title: string;
  meta?: string;
  iconClassName: string;
  iconStyle?: CSSProperties;
};

export const CaptureCardHeader = ({
  icon,
  title,
  meta,
  iconClassName,
  iconStyle,
}: CaptureCardHeaderProps) => (
  <div className="flex min-w-0 flex-1 items-center gap-3.5">
    <div
      className={cn(
        "rounded-12 flex size-11 shrink-0 items-center justify-center",
        iconClassName,
      )}
      style={iconStyle}
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
  </div>
);
