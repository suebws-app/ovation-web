export const daysUntil = (dateStr: string): number => {
  const target = new Date(`${dateStr}T16:00:00`);
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
};

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const money = (value: number): string => usdFormatter.format(value);

export const chartColorVar = (index: number): string =>
  `var(--chart-${(index % 5) + 1})`;

export const formatShortDate = (dateStr: string): string =>
  new Date(`${dateStr}T12:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export const formatLongDate = (dateStr: string): string =>
  new Date(`${dateStr}T12:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const clampPct = (value: number): number =>
  Math.min(100, Math.max(0, value));
