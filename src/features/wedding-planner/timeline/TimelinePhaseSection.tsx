"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { Card } from "@ovation/ui/components/Card";
import { XIcon } from "@ovation/icons/XIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { StatusPill } from "../components/StatusPill";
import { InlineEditText } from "./InlineEditText";
import { AddTaskRow } from "./AddTaskRow";
import { TimelineTaskCard } from "./TimelineTaskCard";
import type { PlannerTodo } from "@/lib/api/types";

type TimelinePhaseSectionProps = {
  containerId: string;
  title: string;
  isPhase: boolean;
  todos: PlannerTodo[];
  onOpen: (todo: PlannerTodo) => void;
  onAddTask: (label: string) => void;
  onRename?: (title: string) => void;
  onRemove?: () => void;
};

export const TimelinePhaseSection = ({
  containerId,
  title,
  isPhase,
  todos,
  onOpen,
  onAddTask,
  onRename,
  onRemove,
}: TimelinePhaseSectionProps) => {
  const t = useTranslations();
  const { setNodeRef, isOver } = useDroppable({ id: containerId });
  const done = todos.filter((todo) => todo.status === "done").length;
  const isComplete = todos.length > 0 && done === todos.length;

  return (
    <Card
      className={cn(
        "transition-colors",
        isComplete && "border-secondary bg-secondary/10",
      )}
    >
      <div className="mb-3.5 flex items-center justify-between gap-3">
        {isPhase && onRename ? (
          <InlineEditText
            value={title}
            ariaLabel={t("wp__timeline__edit_phase")}
            onSave={onRename}
            className="type-h3"
            inputClassName="type-h3"
          />
        ) : (
          <h3 className="type-h3 text-muted-foreground">{title}</h3>
        )}
        <div className="flex items-center gap-2">
          <StatusPill tone={isComplete ? "sage" : "neutral"}>
            {isComplete ? <CheckIcon width={12} height={12} /> : null}
            {t("wp__timeline__done_count", { done, total: todos.length })}
          </StatusPill>
          {isPhase && onRemove ? (
            <button
              type="button"
              aria-label={t("wp__timeline__remove_phase")}
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive"
            >
              <XIcon width={16} height={16} />
            </button>
          ) : null}
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "rounded-12 flex min-h-16 flex-col gap-2.5 p-1 transition-colors",
          isOver && "bg-muted/50",
        )}
      >
        <SortableContext
          items={todos.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          {todos.map((todo) => (
            <TimelineTaskCard key={todo.id} todo={todo} onOpen={onOpen} />
          ))}
        </SortableContext>
        <AddTaskRow onAdd={onAddTask} />
      </div>
    </Card>
  );
};
