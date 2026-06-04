export const UnsupportedProductCard = () => {
  return (
    <div className="rounded-20 border-border bg-card flex flex-col items-start gap-2 border p-6">
      <h2 className="type-h4 font-semibold">Not available yet</h2>
      <p className="type-body-small text-muted-foreground leading-relaxed">
        This product is not currently customisable. Check back soon or browse
        our other keepsakes.
      </p>
    </div>
  );
};
