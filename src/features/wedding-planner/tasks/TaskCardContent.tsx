import { cn } from "@ovation/ui/utils/cn";
import { FlagIcon } from "@ovation/icons/FlagIcon";
import { StatusPill } from "../components/StatusPill";
import { formatShortDate } from "../utils";
import type { PlannerTodo } from "@/lib/api/types";

type TaskCardContentProps = {
  todo: PlannerTodo;
  dragging?: boolean;
  actionSlot?: React.ReactNode;
};

export const TaskCardContent = ({
  todo,
  dragging,
  actionSlot,
}: TaskCardContentProps) => (
  <div
    className={cn(
      "rounded-12 border-border bg-card w-full border p-3.5 text-left transition-colors",
      dragging ? "shadow-lg" : "hover:border-primary/40",
    )}
  >
    <div className="flex items-start justify-between gap-2">
      <span
        className={cn(
          "type-body-small font-semibold",
          todo.status === "done" && "text-muted-foreground line-through",
        )}
      >
        {todo.title}
      </span>
      {todo.priority === "High" && todo.status !== "done" ? (
        <FlagIcon width={15} height={15} className="text-primary shrink-0" />
      ) : null}
    </div>
    <div className="mt-2.5 flex flex-wrap items-center gap-2">
      {todo.category ? (
        <StatusPill tone="neutral">{todo.category}</StatusPill>
      ) : null}
      {todo.dueDate ? (
        <span className="type-caption text-muted-foreground">
          {formatShortDate(todo.dueDate)}
        </span>
      ) : null}
    </div>
    {actionSlot ? <div className="mt-3">{actionSlot}</div> : null}
  </div>
);
