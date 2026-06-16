import { forwardRef } from "react";
import { cn } from "../utils/cn";

export const Skeleton = forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("bg-muted-foreground/15 animate-pulse rounded", className)}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";
