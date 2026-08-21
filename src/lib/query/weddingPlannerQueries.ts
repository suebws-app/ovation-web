"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { weddingPlannerClient } from "@/lib/api/wedding-planner-client";
import {
  clearAssistant,
  getAssistantMessages,
} from "@/lib/api/wedding-planner-assistant-client";
import type {
  CreateCategoryInput,
  CreatePaymentInput,
  CreatePhaseInput,
  CreateTaskInput,
  CreateTodoInput,
  CreateVendorInput,
  PlannerBudget,
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
} from "@/lib/api/types";
import { queryKeys } from "./keys";

type TimelineData = { timeline: PlannerTimeline };
type TasksData = { todos: PlannerTodo[] };
type BudgetData = { budget: PlannerBudget };
type VendorsData = { vendors: PlannerVendor[] };

export const useWeddingPlannerTimeline = (eventId: string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.weddingPlanner.timeline(eventId ?? ""),
    queryFn: () => weddingPlannerClient.getTimeline(eventId!),
    enabled: Boolean(eventId),
    select: (data) => data.timeline.phases,
  });

export const useCreatePhase = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePhaseInput) =>
      weddingPlannerClient.createPhase(eventId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useUpdatePhase = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      phaseId,
      input,
    }: {
      phaseId: string;
      input: UpdatePhaseInput;
    }) => weddingPlannerClient.updatePhase(eventId, phaseId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useDeletePhase = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (phaseId: string) =>
      weddingPlannerClient.deletePhase(eventId, phaseId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useDeleteAllPhases = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => weddingPlannerClient.deleteAllPhases(eventId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useDeleteAllTodos = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => weddingPlannerClient.deleteAllTodos(eventId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useCreateTask = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      phaseId,
      input,
    }: {
      phaseId: string;
      input: CreateTaskInput;
    }) => weddingPlannerClient.createTask(eventId, phaseId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useDeleteTask = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      weddingPlannerClient.deleteTask(eventId, taskId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useUpdateTask = (eventId: string) => {
  const queryClient = useQueryClient();
  const timelineKey = queryKeys.weddingPlanner.timeline(eventId);
  return useMutation<
    { task: PlannerTask },
    Error,
    { taskId: string; input: UpdateTaskInput },
    { previous?: TimelineData }
  >({
    mutationFn: ({ taskId, input }) =>
      weddingPlannerClient.updateTask(eventId, taskId, input),
    onMutate: async ({ taskId, input }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      });
      const previous = queryClient.getQueryData<TimelineData>(timelineKey);
      if (previous) {
        queryClient.setQueryData<TimelineData>(timelineKey, {
          timeline: {
            phases: previous.timeline.phases.map((phase) => ({
              ...phase,
              tasks: phase.tasks.map((task) =>
                task.id === taskId ? { ...task, ...input } : task,
              ),
            })),
          },
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(timelineKey, context.previous);
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useWeddingPlannerTasks = (eventId: string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.weddingPlanner.tasks(eventId ?? ""),
    queryFn: () => weddingPlannerClient.listTodos(eventId!),
    enabled: Boolean(eventId),
    select: (data) => data.todos,
  });

export const useCreateTodo = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTodoInput) =>
      weddingPlannerClient.createTodo(eventId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useDeleteTodo = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (todoId: string) =>
      weddingPlannerClient.deleteTodo(eventId, todoId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useUpdateTodo = (eventId: string) => {
  const queryClient = useQueryClient();
  const tasksKey = queryKeys.weddingPlanner.tasks(eventId);
  return useMutation<
    { todo: PlannerTodo },
    Error,
    { todoId: string; input: UpdateTodoInput },
    { previous?: TasksData }
  >({
    mutationFn: ({ todoId, input }) =>
      weddingPlannerClient.updateTodo(eventId, todoId, input),
    onMutate: async ({ todoId, input }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      });
      const previous = queryClient.getQueryData<TasksData>(tasksKey);
      if (previous) {
        queryClient.setQueryData<TasksData>(tasksKey, {
          todos: previous.todos.map((todo) =>
            todo.id === todoId ? { ...todo, ...input } : todo,
          ),
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(tasksKey, context.previous);
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useWeddingPlannerBudget = (eventId: string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.weddingPlanner.budget(eventId ?? ""),
    queryFn: () => weddingPlannerClient.getBudget(eventId!),
    enabled: Boolean(eventId),
    select: (data) => data.budget,
  });

const invalidateBudget = (
  queryClient: ReturnType<typeof useQueryClient>,
  eventId: string,
) =>
  queryClient.invalidateQueries({
    queryKey: queryKeys.weddingPlanner.all(eventId),
  });

const patchBudget = (
  queryClient: ReturnType<typeof useQueryClient>,
  eventId: string,
  updater: (budget: PlannerBudget) => PlannerBudget,
) => {
  const key = queryKeys.weddingPlanner.budget(eventId);
  const previous = queryClient.getQueryData<BudgetData>(key);
  if (previous) {
    queryClient.setQueryData<BudgetData>(key, {
      budget: updater(previous.budget),
    });
  }
  return previous;
};

export const useSetBudgetTotal = (eventId: string) => {
  const queryClient = useQueryClient();
  const key = queryKeys.weddingPlanner.budget(eventId);
  return useMutation<
    { totalBudget: number },
    Error,
    number,
    { previous?: BudgetData }
  >({
    mutationFn: (totalBudget) =>
      weddingPlannerClient.setBudgetTotal(eventId, totalBudget),
    onMutate: async (totalBudget) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      });
      const previous = patchBudget(queryClient, eventId, (budget) => ({
        ...budget,
        totalBudget,
      }));
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => invalidateBudget(queryClient, eventId),
  });
};

export const useCreateCategory = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      weddingPlannerClient.createCategory(eventId, input),
    onSuccess: () => invalidateBudget(queryClient, eventId),
  });
};

export const useUpdateCategory = (eventId: string) => {
  const queryClient = useQueryClient();
  const key = queryKeys.weddingPlanner.budget(eventId);
  return useMutation<
    unknown,
    Error,
    { categoryId: string; input: UpdateCategoryInput },
    { previous?: BudgetData }
  >({
    mutationFn: ({ categoryId, input }) =>
      weddingPlannerClient.updateCategory(eventId, categoryId, input),
    onMutate: async ({ categoryId, input }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      });
      const previous = patchBudget(queryClient, eventId, (budget) => ({
        ...budget,
        categories: budget.categories.map((category) =>
          category.id === categoryId ? { ...category, ...input } : category,
        ),
      }));
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => invalidateBudget(queryClient, eventId),
  });
};

export const useDeleteCategory = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) =>
      weddingPlannerClient.deleteCategory(eventId, categoryId),
    onSuccess: () => invalidateBudget(queryClient, eventId),
  });
};

export const useDeleteAllBudget = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => weddingPlannerClient.deleteAllBudget(eventId),
    onSuccess: () => invalidateBudget(queryClient, eventId),
  });
};

export const useCreatePayment = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePaymentInput) =>
      weddingPlannerClient.createPayment(eventId, input),
    onSuccess: () => invalidateBudget(queryClient, eventId),
  });
};

export const useUpdatePayment = (eventId: string) => {
  const queryClient = useQueryClient();
  const key = queryKeys.weddingPlanner.budget(eventId);
  return useMutation<
    unknown,
    Error,
    { paymentId: string; input: UpdatePaymentInput },
    { previous?: BudgetData }
  >({
    mutationFn: ({ paymentId, input }) =>
      weddingPlannerClient.updatePayment(eventId, paymentId, input),
    onMutate: async ({ paymentId, input }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      });
      const previous = patchBudget(queryClient, eventId, (budget) => ({
        ...budget,
        payments: budget.payments.map((payment) =>
          payment.id === paymentId ? { ...payment, ...input } : payment,
        ),
      }));
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => invalidateBudget(queryClient, eventId),
  });
};

export const useDeletePayment = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) =>
      weddingPlannerClient.deletePayment(eventId, paymentId),
    onSuccess: () => invalidateBudget(queryClient, eventId),
  });
};

export const useWeddingPlannerVendors = (eventId: string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.weddingPlanner.vendors(eventId ?? ""),
    queryFn: () => weddingPlannerClient.listVendors(eventId!),
    enabled: Boolean(eventId),
    select: (data) => data.vendors,
  });

export const useCreateVendor = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVendorInput) =>
      weddingPlannerClient.createVendor(eventId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useDeleteVendor = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vendorId: string) =>
      weddingPlannerClient.deleteVendor(eventId, vendorId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useUpdateVendor = (eventId: string) => {
  const queryClient = useQueryClient();
  const vendorsKey = queryKeys.weddingPlanner.vendors(eventId);
  return useMutation<
    { vendor: PlannerVendor },
    Error,
    { vendorId: string; input: UpdateVendorInput },
    { previous?: VendorsData }
  >({
    mutationFn: ({ vendorId, input }) =>
      weddingPlannerClient.updateVendor(eventId, vendorId, input),
    onMutate: async ({ vendorId, input }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      });
      const previous = queryClient.getQueryData<VendorsData>(vendorsKey);
      if (previous) {
        queryClient.setQueryData<VendorsData>(vendorsKey, {
          vendors: previous.vendors.map((vendor) =>
            vendor.id === vendorId ? { ...vendor, ...input } : vendor,
          ),
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(vendorsKey, context.previous);
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      }),
  });
};

export const useAssistantMessages = (eventId: string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.weddingPlanner.assistant(eventId ?? ""),
    queryFn: () => getAssistantMessages(eventId!),
    enabled: Boolean(eventId),
  });

export const useClearAssistant = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => clearAssistant(eventId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.assistant(eventId),
      }),
  });
};
