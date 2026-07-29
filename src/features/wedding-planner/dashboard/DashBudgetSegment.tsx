type DashBudgetSegmentProps = {
  pct: number;
  color: string;
  title: string;
};

export const DashBudgetSegment = ({
  pct,
  color,
  title,
}: DashBudgetSegmentProps) => (
  <div title={title} style={{ width: `${pct}%`, backgroundColor: color }} />
);
