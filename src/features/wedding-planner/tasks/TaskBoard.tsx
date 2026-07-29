"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { useUpdateTodo } from "@/lib/query/weddingPlannerQueries";
import { TaskColumn } from "./TaskColumn";
import { TaskCardContent } from "./TaskCardContent";
import type { PlannerTodo, TodoStatus } from "@/lib/api/types";

const STATUSES: TodoStatus[] = ["todo", "inprogress", "done"];

const isStatus = (value: string): value is TodoStatus =>
  (STATUSES as string[]).includes(value);

const reindex = (todos: PlannerTodo[]): PlannerTodo[] => {
  const counters: Record<TodoStatus, number> = {
    todo: 0,
    inprogress: 0,
    done: 0,
  };
  return todos.map((todo) => ({
    ...todo,
    sortOrder: counters[todo.status]++,
  }));
};

type TaskBoardProps = {
  eventId: string;
  todos: PlannerTodo[];
  onOpen: (todo: PlannerTodo) => void;
};

export const TaskBoard = ({ eventId, todos, onOpen }: TaskBoardProps) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const updateTodo = useUpdateTodo(eventId);
  const [board, setBoard] = useState<PlannerTodo[]>(todos);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<PlannerTodo[]>(todos);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  if (!activeId && todos !== lastSynced) {
    setLastSynced(todos);
    setBoard(todos);
  }

  const columnLabel: Record<TodoStatus, string> = {
    todo: t("wp__tasks__col_todo"),
    inprogress: t("wp__tasks__col_inprogress"),
    done: t("wp__tasks__col_done"),
  };

  const byStatus = (status: TodoStatus) =>
    board.filter((todo) => todo.status === status);

  const activeTodo = activeId
    ? (board.find((todo) => todo.id === activeId) ?? null)
    : null;

  const containerOf = (id: string): TodoStatus | undefined =>
    isStatus(id) ? id : board.find((todo) => todo.id === id)?.status;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    const from = containerOf(activeIdStr);
    const to = containerOf(overIdStr);
    if (!from || !to || from === to) return;

    setBoard((prev) => {
      const activeIndex = prev.findIndex((todo) => todo.id === activeIdStr);
      if (activeIndex < 0) return prev;
      const next = [...prev];
      const moved = { ...next[activeIndex], status: to };
      next.splice(activeIndex, 1);

      let insertAt: number;
      if (isStatus(overIdStr)) {
        const lastIndex = next.reduce(
          (acc, todo, index) => (todo.status === to ? index : acc),
          -1,
        );
        insertAt = lastIndex + 1;
      } else {
        insertAt = next.findIndex((todo) => todo.id === overIdStr);
        if (insertAt < 0) insertAt = next.length;
      }
      next.splice(insertAt, 0, moved);
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) {
      setBoard(todos);
      return;
    }

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    let ordered = board;
    if (
      !isStatus(overIdStr) &&
      activeIdStr !== overIdStr &&
      containerOf(activeIdStr) === containerOf(overIdStr)
    ) {
      const oldIndex = board.findIndex((todo) => todo.id === activeIdStr);
      const newIndex = board.findIndex((todo) => todo.id === overIdStr);
      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        ordered = arrayMove(board, oldIndex, newIndex);
      }
    }

    const finalBoard = reindex(ordered);
    setBoard(finalBoard);
    queryClient.setQueryData(queryKeys.weddingPlanner.tasks(eventId), {
      todos: finalBoard,
    });

    const original = new Map(todos.map((todo) => [todo.id, todo]));
    for (const todo of finalBoard) {
      const prev = original.get(todo.id);
      if (!prev) continue;
      if (prev.status !== todo.status || prev.sortOrder !== todo.sortOrder) {
        updateTodo.mutate({
          todoId: todo.id,
          input: { status: todo.status, sortOrder: todo.sortOrder },
        });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="tablet:grid-cols-3 grid gap-4">
        {STATUSES.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            label={columnLabel[status]}
            todos={byStatus(status)}
            onOpen={onOpen}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTodo ? <TaskCardContent todo={activeTodo} dragging /> : null}
      </DragOverlay>
    </DndContext>
  );
};
