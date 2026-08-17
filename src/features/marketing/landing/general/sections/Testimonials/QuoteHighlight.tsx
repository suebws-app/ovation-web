import { type ReactNode } from "react";

type QuoteHighlightProps = {
  children: ReactNode;
};

export const QuoteHighlight = ({ children }: QuoteHighlightProps) => (
  <mark className="bg-accent/45 text-foreground rounded-4 px-0.5">
    {children}
  </mark>
);
