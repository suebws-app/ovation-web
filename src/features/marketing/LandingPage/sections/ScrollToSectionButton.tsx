"use client";

import { Button } from "@ovation/ui/components/Button";

type ScrollToSectionButtonProps = {
  targetId: string;
  children: React.ReactNode;
};

export const ScrollToSectionButton = ({
  targetId,
  children,
}: ScrollToSectionButtonProps) => {
  const handleClick = () => {
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Button type="button" variant="pillGhost" size="pill" onClick={handleClick}>
      {children}
    </Button>
  );
};
