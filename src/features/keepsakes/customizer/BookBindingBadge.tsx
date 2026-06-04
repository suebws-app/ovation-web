type Binding = "hardcover" | "softcover" | "layflat";

const BINDING_LABEL: Record<Binding, string> = {
  hardcover: "Hardcover",
  softcover: "Softcover",
  layflat: "Layflat",
};

const BINDING_HINT: Record<Binding, string> = {
  hardcover: "Rigid linen-wrapped cover with foil options",
  softcover: "Flexible, lightweight, and travel-friendly",
  layflat: "Premium photo-grade paper, lays perfectly flat",
};

type BookBindingBadgeProps = {
  binding: Binding;
  paperStock: string | null;
  pageWidthMm: number | null;
  pageHeightMm: number | null;
};

export const BookBindingBadge = ({
  binding,
  paperStock,
  pageWidthMm,
  pageHeightMm,
}: BookBindingBadgeProps) => {
  const dimensions =
    pageWidthMm && pageHeightMm ? `${pageWidthMm} × ${pageHeightMm} mm` : null;

  return (
    <div className="rounded-16 border-border bg-card flex flex-wrap items-center gap-3 border px-4 py-3">
      <span className="rounded-full bg-primary/15 text-primary type-caption px-3 py-1 font-semibold tracking-wider">
        {BINDING_LABEL[binding]}
      </span>
      <span className="type-body-small text-muted-foreground">
        {BINDING_HINT[binding]}
      </span>
      {(dimensions || paperStock) && (
        <span className="type-caption text-muted-foreground ms-auto tracking-wider">
          {[dimensions, paperStock].filter(Boolean).join(" · ")}
        </span>
      )}
    </div>
  );
};
