import { useTranslations } from "next-intl";

type Binding = "hardcover" | "softcover" | "layflat";

const BINDING_LABEL_KEY: Record<Binding, string> = {
  hardcover: "keepsakes__book_binding__hardcover_label",
  softcover: "keepsakes__book_binding__softcover_label",
  layflat: "keepsakes__book_binding__layflat_label",
};

const BINDING_HINT_KEY: Record<Binding, string> = {
  hardcover: "keepsakes__book_binding__hardcover_hint",
  softcover: "keepsakes__book_binding__softcover_hint",
  layflat: "keepsakes__book_binding__layflat_hint",
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
  const t = useTranslations();
  const dimensions =
    pageWidthMm && pageHeightMm ? `${pageWidthMm} × ${pageHeightMm} mm` : null;

  return (
    <div className="rounded-16 border-border bg-card flex flex-wrap items-center gap-3 border px-4 py-3">
      <span className="rounded-full bg-primary/15 text-primary type-caption px-3 py-1 font-semibold tracking-wider">
        {t(BINDING_LABEL_KEY[binding])}
      </span>
      <span className="type-body-small text-muted-foreground">
        {t(BINDING_HINT_KEY[binding])}
      </span>
      {(dimensions || paperStock) && (
        <span className="type-caption text-muted-foreground ms-auto tracking-wider">
          {[dimensions, paperStock].filter(Boolean).join(" · ")}
        </span>
      )}
    </div>
  );
};
