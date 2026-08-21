import { type ReactNode } from "react";

type SocialProofHighlightProps = {
  children: ReactNode;
};

export const SocialProofHighlight = ({
  children,
}: SocialProofHighlightProps) => (
  <span className="text-primary">{children}</span>
);
