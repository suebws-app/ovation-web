interface SeoStatTileProps {
  label: string;
  value: string;
}

export const SeoStatTile = ({ label, value }: SeoStatTileProps) => (
  <div className="border-border rounded-16 border p-6">
    <p className="type-body-small text-muted-foreground tracking-wide uppercase">
      {label}
    </p>
    <p className="type-h2 text-foreground mt-3 font-semibold">{value}</p>
  </div>
);
