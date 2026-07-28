type DashBudgetLegendItemProps = {
  label: string;
  color: string;
};

export const DashBudgetLegendItem = ({
  label,
  color,
}: DashBudgetLegendItemProps) => (
  <div className="type-caption text-muted-foreground flex items-center gap-1.5">
    <span
      className="rounded-4 size-2.5 shrink-0"
      style={{ backgroundColor: color }}
    />
    {label}
  </div>
);
