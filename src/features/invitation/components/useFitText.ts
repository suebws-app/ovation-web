"use client";

import { useLayoutEffect, useRef, useState } from "react";

type UseFitTextArgs = {
  maxPx: number;
  minPx: number;
  deps: unknown[];
};

/**
 * Shrinks a single line of text to fit the width of a container element.
 * Returns a container ref, a text ref, and the font size (px) to apply to the
 * text. The text must be kept on one line (whitespace-nowrap) so its measured
 * width reflects the full unwrapped content.
 */
export const useFitText = <T extends HTMLElement = HTMLElement>({
  maxPx,
  minPx,
  deps,
}: UseFitTextArgs) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<T>(null);
  const [fontSize, setFontSize] = useState(maxPx);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const measure = () => {
      const cs = getComputedStyle(container);
      const available =
        container.clientWidth -
        parseFloat(cs.paddingLeft || "0") -
        parseFloat(cs.paddingRight || "0");
      if (available <= 0) return;

      text.style.fontSize = `${maxPx}px`;
      if (text.scrollWidth <= available) {
        setFontSize(maxPx);
        return;
      }

      let lo = minPx;
      let hi = maxPx;
      for (let i = 0; i < 10; i += 1) {
        const mid = (lo + hi) / 2;
        text.style.fontSize = `${mid}px`;
        if (text.scrollWidth <= available) lo = mid;
        else hi = mid;
      }
      setFontSize(lo);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(container);

    let cancelled = false;
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }

    return () => {
      cancelled = true;
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { containerRef, textRef, fontSize };
};
