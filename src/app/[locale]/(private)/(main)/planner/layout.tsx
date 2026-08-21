import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { getCurrentEvent } from "@/lib/auth/current-event";
import { getEventTypeConfig } from "@/lib/event-types";

export default async function WeddingPlannerLayout({
  children,
}: {
  children: ReactNode;
}) {
  // The planner is disabled for some event types (e.g. memorial). Block the
  // whole /planner/* subtree at one choke point so a host of such a type can't
  // reach the dashboard or any sub-page directly.
  const event = await getCurrentEvent();
  if (event && !getEventTypeConfig(event.eventType).features.planner) {
    notFound();
  }
  return <div className={containerClassName}>{children}</div>;
}
