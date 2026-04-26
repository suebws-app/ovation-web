type OrderItemProps = {
  title: string;
  status: string;
  pct: number;
  color: string;
};

export const OrderItem = ({ title, status, pct, color }: OrderItemProps) => (
  <div className="rounded-12 border-border bg-background border p-3">
    <div className="flex items-baseline justify-between">
      <span className="type-body-small font-semibold">{title}</span>
      <span className="type-caption text-muted-foreground">{status}</span>
    </div>
    <div className="bg-border mt-2 h-1 overflow-hidden rounded-full">
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  </div>
);
