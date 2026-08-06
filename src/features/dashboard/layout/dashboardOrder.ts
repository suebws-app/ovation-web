import type { EventPhase } from "@/lib/event-types";

export interface DashboardColumnOrder {
  sidebar: string;
  main: string;
}

export const isPlannerFirst = (phase: EventPhase): boolean =>
  phase === "planning";

export const getColumnOrder = (phase: EventPhase): DashboardColumnOrder =>
  phase === "planning"
    ? { sidebar: "order-1", main: "order-2" }
    : { sidebar: "order-2", main: "order-1" };
