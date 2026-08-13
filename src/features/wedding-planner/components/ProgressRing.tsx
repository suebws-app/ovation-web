import { clampPct } from "../utils";

type ProgressRingProps = {
  pct: number;
  label: string;
  sub?: string;
  size?: number;
};

export const ProgressRing = ({
  pct,
  label,
  sub,
  size = 132,
}: ProgressRingProps) => {
  const stroke = 13;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clampPct(pct) / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="leading-none font-semibold"
          style={{ fontSize: size * 0.28 }}
        >
          {label}
        </span>
        {sub ? (
          <span className="type-overline text-muted-foreground mt-1">
            {sub}
          </span>
        ) : null}
      </div>
    </div>
  );
};
