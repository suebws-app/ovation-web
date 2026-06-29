"use client";

import type { ReactNode } from "react";

type PhonePreviewProps = {
  children: ReactNode;
};

export const PhonePreview = ({ children }: PhonePreviewProps) => (
  <div className="border-foreground/15 bg-foreground/90 relative h-150 w-75 overflow-hidden rounded-[42px] border-10 shadow-2xl">
    <div className="bg-foreground/90 absolute top-0 left-1/2 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl" />
    <div className="size-full overflow-hidden bg-white">{children}</div>
  </div>
);
