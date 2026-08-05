import { weddingPlannerApi } from "@/lib/api/wedding-planner";
import { daysUntil } from "@/features/wedding-planner/utils";
import type { Event } from "@/lib/api/types";
import {
  WeddingPlannerWidget,
  type WeddingPlannerWidgetSummary,
} from "../components/widgets/WeddingPlannerWidget";

type PlannerSectionProps = {
  event: Event;
};

export const PlannerSection = async ({ event }: PlannerSectionProps) => {
  const [plannerTodos, plannerBudget] = await Promise.all([
    weddingPlannerApi.listTodos(event.id).catch(() => ({ todos: [] })),
    weddingPlannerApi.getBudget(event.id).catch(() => ({
      budget: { totalBudget: 0, categories: [], payments: [] },
    })),
  ]);

  const todos = plannerTodos?.todos ?? [];
  const totalTasks = todos.length;
  const doneTasks = todos.filter((todo) => todo.status === "done").length;
  const byDueDate = (
    a: { dueDate: string | null },
    b: { dueDate: string | null },
  ) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");
  const nextOpen = todos
    .filter((todo) => todo.status !== "done")
    .sort(byDueDate)
    .slice(0, 3);
  const categories = plannerBudget?.budget.categories ?? [];
  const totalBudget = plannerBudget?.budget.totalBudget ?? 0;
  const spent = categories.reduce((sum, category) => sum + category.actual, 0);

  const summary: WeddingPlannerWidgetSummary = {
    weddingDate: event.weddingDate,
    daysToGo: event.weddingDate ? daysUntil(event.weddingDate) : null,
    progressPct: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0,
    doneTasks,
    totalTasks,
    nextTasks: nextOpen.map((todo) => ({
      title: todo.title,
      dueDate: todo.dueDate,
    })),
    totalBudget,
    spent,
    remaining: totalBudget - spent,
  };

  return <WeddingPlannerWidget summary={summary} />;
};
