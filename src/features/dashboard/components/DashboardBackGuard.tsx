"use client";

import { useDisableBackNavigation } from "@/lib/hooks/useDisableBackNavigation";

export function DashboardBackGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  useDisableBackNavigation();
  return children;
}
