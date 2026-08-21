import type { ReactNode } from "react";

type DonutSegment = { value: number; color: string };

type RsvpDonutProps = {
  segments: DonutSegment[];
  total: number;
  size?: number;
  children?: ReactNode;
};

export const RsvpDonut = ({
  segments,
  total,
  size = 148,
  children,
}: RsvpDonutProps) => {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let consumed = 0;

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
        {total > 0
          ? segments.map((segment, index) => {
              const dash = circumference * (segment.value / total);
              const gap = circumference - dash;
              const dashOffset = -consumed;
              consumed += dash;
              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={dashOffset}
                  className="transition-[stroke-dasharray] duration-700 ease-out"
                />
              );
            })
          : null}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};
