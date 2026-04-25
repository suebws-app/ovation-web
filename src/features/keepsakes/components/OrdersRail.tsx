import { Eyebrow } from "@ovation/ui/components/Eyebrow";

const ORDERS = [
  {
    title: "Thank-You Cards",
    status: "Shipped \u00b7 arrives 27 Jun",
    pct: 78,
    color: "var(--secondary)",
  },
  {
    title: "Audio Vinyl",
    status: "Pressing \u00b7 week 3 of 4",
    pct: 58,
    color: "var(--accent)",
  },
  {
    title: "QR cards \u00b7 50",
    status: "Delivered 18 Jun",
    pct: 100,
    color: "var(--primary)",
  },
];

export const OrdersRail = () => (
  <div className="rounded-20 border-border bg-card flex flex-col gap-3.5 border p-5">
    <div className="flex items-center gap-2">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="6" width="14" height="10" rx="1" />
        <path d="M15 9h4l3 4v3h-7M5.5 18a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM18.5 18a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
      </svg>
      <Eyebrow className="text-muted-foreground">Your orders</Eyebrow>
      <button
        type="button"
        className="type-caption text-primary ml-auto cursor-pointer font-semibold"
      >
        See all &rarr;
      </button>
    </div>
    {ORDERS.map((o) => (
      <OrderItem key={o.title} {...o} />
    ))}
  </div>
);

const OrderItem = ({
  title,
  status,
  pct,
  color,
}: {
  title: string;
  status: string;
  pct: number;
  color: string;
}) => (
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
