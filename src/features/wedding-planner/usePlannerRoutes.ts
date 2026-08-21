"use client";

import { appRoutes } from "@/lib/routes";
import { useEventId } from "@/features/events/EventContext";

type PlannerRoutes = {
  dashboard: string;
  timeline: string;
  tasks: string;
  budget: string;
  guests: string;
  vendors: string;
  assistant: string;
  invitation: string;
};

export const usePlannerRoutes = (): PlannerRoutes => {
  const eventId = useEventId();

  if (!eventId) {
    const wp = appRoutes.app.weddingPlanner;
    return {
      dashboard: wp.dashboard,
      timeline: wp.timeline,
      tasks: wp.tasks,
      budget: wp.budget,
      guests: wp.guests,
      vendors: wp.vendors,
      assistant: wp.assistant,
      invitation: appRoutes.app.invitation,
    };
  }

  return {
    dashboard: appRoutes.app.eventPlannerDashboard(eventId),
    timeline: appRoutes.app.eventPlannerTimeline(eventId),
    tasks: appRoutes.app.eventPlannerTasks(eventId),
    budget: appRoutes.app.eventPlannerBudget(eventId),
    guests: appRoutes.app.eventPlannerGuests(eventId),
    vendors: appRoutes.app.eventPlannerVendors(eventId),
    assistant: appRoutes.app.eventPlannerAssistant(eventId),
    invitation: appRoutes.app.eventInvitation(eventId),
  };
};
