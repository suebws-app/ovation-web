"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@ovation/ui/utils/cn";
import { TaskCardContent } from "./TaskCardContent";
import type { PlannerTodo } from "@/lib/api/types";

type TaskCardProps = {
  todo: PlannerTodo;
  onOpen: (todo: PlannerTodo) => void;
};

export const TaskCard = ({ todo, onOpen }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, data: { status: todo.status } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    touchAction: "none" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(todo)}
      className={cn("cursor-pointer", isDragging && "opacity-40")}
    >
      <TaskCardContent todo={todo} />
    </div>
  );
};
