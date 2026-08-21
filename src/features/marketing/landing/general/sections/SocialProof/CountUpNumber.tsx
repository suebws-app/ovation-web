"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

type CountUpNumberProps = {
  value: number;
  tickMs: number;
};

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const CountUpNumber = ({ value, tickMs }: CountUpNumberProps) => {
  const locale = useLocale();
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const interval = setInterval(
      () => setCurrentValue((previous) => previous + 1),
      tickMs,
    );

    return () => clearInterval(interval);
  }, [tickMs]);

  return (
    <span key={currentValue} className="ov-tick-number tabular-nums">
      {new Intl.NumberFormat(locale).format(currentValue)}
    </span>
  );
};
