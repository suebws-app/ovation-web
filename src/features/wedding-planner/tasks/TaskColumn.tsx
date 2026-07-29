"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@ovation/ui/utils/cn";
import { TaskCard } from "./TaskCard";
import type { PlannerTodo, TodoStatus } from "@/lib/api/types";

type TaskColumnProps = {
  status: TodoStatus;
  label: string;
  todos: PlannerTodo[];
  onOpen: (todo: PlannerTodo) => void;
};

const dotColor: Record<TodoStatus, string> = {
  todo: "bg-primary",
  inprogress: "bg-accent",
  done: "bg-secondary",
};

export const TaskColumn = ({
  status,
  label,
  todos,
  onOpen,
}: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className={cn("size-2.5 rounded-full", dotColor[status])} />
        <span className="type-overline text-muted-foreground">{label}</span>
        <span className="type-caption text-muted-foreground">
          {todos.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "rounded-12 flex min-h-24 flex-col gap-2.5 p-1 transition-colors",
          isOver && "bg-muted/50",
        )}
      >
        <SortableContext
          items={todos.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          {todos.map((todo) => (
            <TaskCard key={todo.id} todo={todo} onOpen={onOpen} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
