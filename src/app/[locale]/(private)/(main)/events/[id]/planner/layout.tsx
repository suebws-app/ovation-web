import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { containerClassName } from "@/lib/utils/layoutClassNames";
import { getEventFromParams } from "@/lib/auth/event-from-params";
import { getEventTypeConfig } from "@/lib/event-types";

export default async function EventPlannerLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) {
  const event = await getEventFromParams(params);
  if (!getEventTypeConfig(event.eventType).features.planner) {
    notFound();
  }
  return <div className={containerClassName}>{children}</div>;
}
