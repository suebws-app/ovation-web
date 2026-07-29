import { clientFetch } from "./client";
import type {
  CreateCategoryInput,
  CreatePaymentInput,
  CreatePhaseInput,
  CreateTaskInput,
  CreateTodoInput,
  CreateVendorInput,
  PlannerBudget,
  PlannerBudgetCategory,
  PlannerPayment,
  PlannerPhase,
  PlannerTask,
  PlannerTimeline,
  PlannerTodo,
  PlannerVendor,
  UpdateCategoryInput,
  UpdatePaymentInput,
  UpdatePhaseInput,
  UpdateTaskInput,
  UpdateTodoInput,
  UpdateVendorInput,
} from "./types";

const plannerPath = (eventId: string) => `/events/${eventId}/planner`;

export const weddingPlannerClient = {
  getTimeline: (eventId: string) =>
    clientFetch<{ timeline: PlannerTimeline }>(
      `${plannerPath(eventId)}/timeline`,
    ),

  createPhase: (eventId: string, input: CreatePhaseInput) =>
    clientFetch<{ phase: PlannerPhase }>(`${plannerPath(eventId)}/phases`, {
      method: "POST",
      body: input,
    }),

  updatePhase: (eventId: string, phaseId: string, input: UpdatePhaseInput) =>
    clientFetch<{ phase: PlannerPhase }>(
      `${plannerPath(eventId)}/phases/${phaseId}`,
      { method: "PATCH", body: input },
    ),

  deletePhase: (eventId: string, phaseId: string) =>
    clientFetch<void>(`${plannerPath(eventId)}/phases/${phaseId}`, {
      method: "DELETE",
    }),

  createTask: (eventId: string, phaseId: string, input: CreateTaskInput) =>
    clientFetch<{ task: PlannerTask }>(
      `${plannerPath(eventId)}/phases/${phaseId}/tasks`,
      { method: "POST", body: input },
    ),

  updateTask: (eventId: string, taskId: string, input: UpdateTaskInput) =>
    clientFetch<{ task: PlannerTask }>(
      `${plannerPath(eventId)}/tasks/${taskId}`,
      { method: "PATCH", body: input },
    ),

  deleteTask: (eventId: string, taskId: string) =>
    clientFetch<void>(`${plannerPath(eventId)}/tasks/${taskId}`, {
      method: "DELETE",
    }),

  listTodos: (eventId: string) =>
    clientFetch<{ todos: PlannerTodo[] }>(`${plannerPath(eventId)}/todos`),

  createTodo: (eventId: string, input: CreateTodoInput) =>
    clientFetch<{ todo: PlannerTodo }>(`${plannerPath(eventId)}/todos`, {
      method: "POST",
      body: input,
    }),

  updateTodo: (eventId: string, todoId: string, input: UpdateTodoInput) =>
    clientFetch<{ todo: PlannerTodo }>(
      `${plannerPath(eventId)}/todos/${todoId}`,
      { method: "PATCH", body: input },
    ),

  deleteTodo: (eventId: string, todoId: string) =>
    clientFetch<void>(`${plannerPath(eventId)}/todos/${todoId}`, {
      method: "DELETE",
    }),

  getBudget: (eventId: string) =>
    clientFetch<{ budget: PlannerBudget }>(`${plannerPath(eventId)}/budget`),

  setBudgetTotal: (eventId: string, totalBudget: number) =>
    clientFetch<{ totalBudget: number }>(
      `${plannerPath(eventId)}/budget/total`,
      { method: "PUT", body: { totalBudget } },
    ),

  createCategory: (eventId: string, input: CreateCategoryInput) =>
    clientFetch<{ category: PlannerBudgetCategory }>(
      `${plannerPath(eventId)}/budget/categories`,
      { method: "POST", body: input },
    ),

  updateCategory: (
    eventId: string,
    categoryId: string,
    input: UpdateCategoryInput,
  ) =>
    clientFetch<{ category: PlannerBudgetCategory }>(
      `${plannerPath(eventId)}/budget/categories/${categoryId}`,
      { method: "PATCH", body: input },
    ),

  deleteCategory: (eventId: string, categoryId: string) =>
    clientFetch<void>(
      `${plannerPath(eventId)}/budget/categories/${categoryId}`,
      { method: "DELETE" },
    ),

  createPayment: (eventId: string, input: CreatePaymentInput) =>
    clientFetch<{ payment: PlannerPayment }>(
      `${plannerPath(eventId)}/budget/payments`,
      { method: "POST", body: input },
    ),

  updatePayment: (
    eventId: string,
    paymentId: string,
    input: UpdatePaymentInput,
  ) =>
    clientFetch<{ payment: PlannerPayment }>(
      `${plannerPath(eventId)}/budget/payments/${paymentId}`,
      { method: "PATCH", body: input },
    ),

  deletePayment: (eventId: string, paymentId: string) =>
    clientFetch<void>(`${plannerPath(eventId)}/budget/payments/${paymentId}`, {
      method: "DELETE",
    }),

  listVendors: (eventId: string) =>
    clientFetch<{ vendors: PlannerVendor[] }>(
      `${plannerPath(eventId)}/vendors`,
    ),

  createVendor: (eventId: string, input: CreateVendorInput) =>
    clientFetch<{ vendor: PlannerVendor }>(`${plannerPath(eventId)}/vendors`, {
      method: "POST",
      body: input,
    }),

  updateVendor: (eventId: string, vendorId: string, input: UpdateVendorInput) =>
    clientFetch<{ vendor: PlannerVendor }>(
      `${plannerPath(eventId)}/vendors/${vendorId}`,
      { method: "PATCH", body: input },
    ),

  deleteVendor: (eventId: string, vendorId: string) =>
    clientFetch<void>(`${plannerPath(eventId)}/vendors/${vendorId}`, {
      method: "DELETE",
    }),
};
