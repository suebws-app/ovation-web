import { apiFetch } from "./server";
import type {
  AssistantMessage,
  PlannerBudget,
  PlannerTimeline,
  PlannerTodo,
  PlannerVendor,
} from "./types";

export const weddingPlannerApi = {
  getTimeline: (eventId: string) =>
    apiFetch<{ timeline: PlannerTimeline }>(
      `/events/${eventId}/planner/timeline`,
    ),

  listTodos: (eventId: string) =>
    apiFetch<{ todos: PlannerTodo[] }>(`/events/${eventId}/planner/todos`),

  getBudget: (eventId: string) =>
    apiFetch<{ budget: PlannerBudget }>(`/events/${eventId}/planner/budget`),

  listVendors: (eventId: string) =>
    apiFetch<{ vendors: PlannerVendor[] }>(
      `/events/${eventId}/planner/vendors`,
    ),

  getAssistantMessages: (eventId: string) =>
    apiFetch<{ messages: AssistantMessage[]; hasMore: boolean }>(
      `/events/${eventId}/planner/assistant/messages`,
    ),
};
