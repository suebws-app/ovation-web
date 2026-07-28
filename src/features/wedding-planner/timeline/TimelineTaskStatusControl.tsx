"use client";

import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ovation/ui/components/DropdownMenu";
import { ChevronDownIcon } from "@ovation/icons/ChevronDownIcon";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import { StatusPill, type PillTone } from "../components/StatusPill";
import { useUpdateTodo } from "@/lib/query/weddingPlannerQueries";
import type { PlannerTodo, TodoStatus } from "@/lib/api/types";

const STATUS_OPTIONS: {
  value: TodoStatus;
  labelKey: string;
  tone: PillTone;
}[] = [
  { value: "todo", labelKey: "wp__tasks__col_todo", tone: "neutral" },
  { value: "inprogress", labelKey: "wp__tasks__col_inprogress", tone: "gold" },
  { value: "done", labelKey: "wp__tasks__col_done", tone: "sage" },
];

type TimelineTaskStatusControlProps = {
  todo: PlannerTodo;
};

export const TimelineTaskStatusControl = ({
  todo,
}: TimelineTaskStatusControlProps) => {
  const t = useTranslations();
  const updateTodo = useUpdateTodo(todo.eventId);
  const active =
    STATUS_OPTIONS.find((option) => option.value === todo.status) ??
    STATUS_OPTIONS[0];

  const onSelectStatus = (status: TodoStatus) => {
    if (status === todo.status) return;
    updateTodo.mutate({ todoId: todo.id, input: { status } });
  };

  return (
    <span
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="focus-visible:ring-ring cursor-pointer rounded-full outline-none focus-visible:ring-2"
          >
            <StatusPill
              tone={active.tone}
              className="type-caption gap-1.5 px-3 py-1 font-semibold"
            >
              {t(active.labelKey)}
              <ChevronDownIcon width={13} height={13} />
            </StatusPill>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onSelectStatus(option.value)}
            >
              <span className="flex-1">{t(option.labelKey)}</span>
              {option.value === todo.status ? (
                <CheckIcon width={12} height={12} />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
};
