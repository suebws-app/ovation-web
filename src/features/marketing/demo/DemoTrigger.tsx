"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Button } from "@ovation/ui/components/Button";

const DemoSheet = dynamic(
  () => import("./DemoSheet").then((m) => ({ default: m.DemoSheet })),
  { ssr: false },
);

type DemoTriggerProps = {
  children: ReactNode;
  className?: string;
};

export const DemoTrigger = ({ children, className }: DemoTriggerProps) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openSheet = () => {
    setMounted(true);
    setOpen(true);
  };

  return (
    <>
      <Button
        variant="pillGhost"
        size="pill"
        onClick={openSheet}
        className={className}
      >
        {children}
      </Button>
      {mounted && <DemoSheet open={open} onOpenChange={setOpen} />}
    </>
  );
};
