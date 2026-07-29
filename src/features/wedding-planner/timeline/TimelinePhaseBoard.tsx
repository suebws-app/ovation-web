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
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { useUpdateTodo } from "@/lib/query/weddingPlannerQueries";
import { TaskCardContent } from "../tasks/TaskCardContent";
import { TimelinePhaseSection } from "./TimelinePhaseSection";
import type { PlannerPhase, PlannerTodo } from "@/lib/api/types";

const UNASSIGNED = "unassigned";

const containerKey = (todo: PlannerTodo) => todo.phaseId ?? UNASSIGNED;

const reindex = (todos: PlannerTodo[]): PlannerTodo[] => {
  const counters = new Map<string, number>();
  return todos.map((todo) => {
    const key = containerKey(todo);
    const index = counters.get(key) ?? 0;
    counters.set(key, index + 1);
    return { ...todo, sortOrder: index };
  });
};

type TimelinePhaseBoardProps = {
  eventId: string;
  phases: PlannerPhase[];
  todos: PlannerTodo[];
  unassignedLabel: string;
  onOpen: (todo: PlannerTodo) => void;
  onAddTask: (containerId: string, label: string) => void;
  onRenamePhase: (phaseId: string, title: string) => void;
  onRemovePhase: (phaseId: string) => void;
};

export const TimelinePhaseBoard = ({
  eventId,
  phases,
  todos,
  unassignedLabel,
  onOpen,
  onAddTask,
  onRenamePhase,
  onRemovePhase,
}: TimelinePhaseBoardProps) => {
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

  const containers = [...phases.map((p) => p.id), UNASSIGNED];
  const isContainer = (id: string) => containers.includes(id);
  const byContainer = (key: string) =>
    board.filter((todo) => containerKey(todo) === key);
  const activeTodo = activeId
    ? (board.find((todo) => todo.id === activeId) ?? null)
    : null;

  const containerOf = (id: string): string | undefined => {
    if (isContainer(id)) return id;
    const todo = board.find((t) => t.id === id);
    return todo ? containerKey(todo) : undefined;
  };

  const withContainer = (todo: PlannerTodo, key: string): PlannerTodo => ({
    ...todo,
    phaseId: key === UNASSIGNED ? null : key,
  });

  const handleDragStart = (event: DragStartEvent) =>
    setActiveId(String(event.active.id));

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
      const moved = withContainer(next[activeIndex], to);
      next.splice(activeIndex, 1);

      let insertAt: number;
      if (isContainer(overIdStr)) {
        const lastIndex = next.reduce(
          (acc, todo, index) => (containerKey(todo) === to ? index : acc),
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
      !isContainer(overIdStr) &&
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
      if (prev.phaseId !== todo.phaseId || prev.sortOrder !== todo.sortOrder) {
        updateTodo.mutate({
          todoId: todo.id,
          input: { phaseId: todo.phaseId, sortOrder: todo.sortOrder },
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
      <div className="relative pl-8">
        <div className="bg-border absolute top-2 bottom-2 left-2.5 w-0.5" />
        <div className="flex flex-col gap-5">
          {phases.map((phase) => (
            <TimelinePhaseSection
              key={phase.id}
              containerId={phase.id}
              title={phase.title}
              isPhase
              todos={byContainer(phase.id)}
              onOpen={onOpen}
              onAddTask={(label) => onAddTask(phase.id, label)}
              onRename={(title) => onRenamePhase(phase.id, title)}
              onRemove={() => onRemovePhase(phase.id)}
            />
          ))}
          <TimelinePhaseSection
            containerId={UNASSIGNED}
            title={unassignedLabel}
            isPhase={false}
            todos={byContainer(UNASSIGNED)}
            onOpen={onOpen}
            onAddTask={(label) => onAddTask(UNASSIGNED, label)}
          />
        </div>
      </div>
      <DragOverlay>
        {activeTodo ? <TaskCardContent todo={activeTodo} dragging /> : null}
      </DragOverlay>
    </DndContext>
  );
};
