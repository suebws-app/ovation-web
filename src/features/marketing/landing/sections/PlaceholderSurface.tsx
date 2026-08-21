import { cn } from "@ovation/ui/utils/cn";

type PlaceholderSurfaceProps = {
  label?: string;
  className?: string;
  variant?: "blush" | "sage" | "gold" | "ivory" | "terra" | "deep";
  children?: React.ReactNode;
};

const VARIANT_CLASSES: Record<
  NonNullable<PlaceholderSurfaceProps["variant"]>,
  string
> = {
  blush: "bg-linear-to-br from-primary/25 to-warm-cream",
  sage: "bg-linear-to-br from-secondary/40 to-warm-cream",
  gold: "bg-linear-to-br from-accent/45 to-warm-cream",
  ivory: "bg-linear-to-br from-warm-cream to-warm-panel",
  terra: "bg-linear-to-br from-primary/70 to-primary",
  deep: "bg-linear-to-br from-foreground to-foreground/80",
};

export const PlaceholderSurface = ({
  className,
  variant = "ivory",
  children,
}: PlaceholderSurfaceProps) => (
  <div
    className={cn(
      "relative flex size-full items-center justify-center",
      VARIANT_CLASSES[variant],
      className,
    )}
  >
    {children}
  </div>
);
