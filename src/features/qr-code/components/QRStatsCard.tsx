import { Eyebrow } from "@ovation/ui/components/Eyebrow";

const STATS = [
  { value: "412", label: "Total scans" },
  { value: "142", label: "Messages recorded" },
  { value: "34%", label: "Scan \u2192 message", positive: true },
];

export const QRStatsCard = () => (
  <div className="rounded-16 border-border bg-card border p-4.5">
    <Eyebrow className="text-muted-foreground">How it&apos;s doing</Eyebrow>
    <div className="mt-3.5 grid grid-cols-3 gap-4">
      {STATS.map((s) => (
        <QRStat key={s.label} {...s} />
      ))}
    </div>

    <div className="mt-3.5">
      <svg
        width="100%"
        height="48"
        viewBox="0 0 320 48"
        preserveAspectRatio="none"
        className="block"
      >
        <defs>
          <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 40 L40 34 L80 36 L120 28 L160 24 L200 18 L240 20 L280 10 L320 6 L320 48 L0 48 Z"
          fill="url(#sparkline-fill)"
        />
        <path
          d="M0 40 L40 34 L80 36 L120 28 L160 24 L200 18 L240 20 L280 10 L320 6"
          stroke="var(--primary)"
          strokeWidth="2"
          fill="none"
        />
      </svg>
      <div className="type-caption text-muted-foreground mt-1.5 flex justify-between">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  </div>
);

const QRStat = ({
  value,
  label,
  positive,
}: {
  value: string;
  label: string;
  positive?: boolean;
}) => (
  <div>
    <p
      className={`font-serif text-[2rem] font-semibold tracking-tight ${positive ? "text-secondary" : "text-foreground"}`}
    >
      {value}
    </p>
    <p className="type-caption text-muted-foreground mt-0.5">{label}</p>
  </div>
);
