import { cn } from "@ovation/ui/utils/cn";
import { StatusPill } from "../components/StatusPill";
import type { PlannerTodo } from "@/lib/api/types";

type DashTaskItemProps = {
  task: PlannerTodo;
  priorityLabel: string;
};

export const DashTaskItem = ({ task, priorityLabel }: DashTaskItemProps) => {
  const meta = [task.category, task.owner].filter(Boolean).join(" · ");
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "rounded-6 size-4.5 shrink-0 border-2",
          task.priority === "High" ? "border-primary" : "border-border",
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="type-body-small truncate font-medium">{task.title}</p>
        {meta ? (
          <p className="type-caption text-muted-foreground truncate">{meta}</p>
        ) : null}
      </div>
      {task.priority === "High" ? (
        <StatusPill tone="primary">{priorityLabel}</StatusPill>
      ) : null}
    </div>
  );
};
