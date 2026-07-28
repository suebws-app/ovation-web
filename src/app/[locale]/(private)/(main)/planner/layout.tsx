import type { ReactNode } from "react";
import { containerClassName } from "@/lib/utils/layoutClassNames";

export default function WeddingPlannerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className={containerClassName}>{children}</div>;
}
