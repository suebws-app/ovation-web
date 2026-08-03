"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { cn } from "@ovation/ui/utils/cn";
import { Button } from "@ovation/ui/components/Button";
import { Input } from "@ovation/ui/components/Input";
import { Calendar } from "@ovation/ui/components/DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ovation/ui/components/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ovation/ui/components/Select";
import { CalendarIcon } from "@ovation/icons/CalendarIcon";
import { TrashIcon } from "@ovation/icons/TrashIcon";
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
  useWeddingPlannerTimeline,
} from "@/lib/query/weddingPlannerQueries";
import type { PlannerTodo, TodoPriority, TodoStatus } from "@/lib/api/types";
import { toIsoDate, parseIsoDate } from "@/lib/utils/formatDate";
import { getTaskSchema, type TaskFields } from "./taskSchema";
import { FieldHint } from "../components/FieldHint";

type TaskModalProps = {
  eventId: string;
  open: boolean;
  todo: PlannerTodo | null;
  onClose: () => void;
};

const emptyDefaults: TaskFields = {
  title: "",
  status: "todo",
  priority: "Medium",
  category: "",
  dueDate: "",
  owner: "",
  cost: "",
  vendor: "",
  note: "",
  blockedBy: "",
  phaseId: "none",
};

const toDefaults = (todo: PlannerTodo | null): TaskFields =>
  todo
    ? {
        title: todo.title,
        status: todo.status,
        priority: todo.priority,
        category: todo.category ?? "",
        dueDate: todo.dueDate ?? "",
        owner: todo.owner ?? "",
        cost: todo.cost != null ? String(todo.cost) : "",
        vendor: todo.vendor ?? "",
        note: todo.note ?? "",
        blockedBy: todo.blockedBy ?? "",
        phaseId: todo.phaseId ?? "none",
      }
    : emptyDefaults;

export const TaskModal = ({ eventId, open, todo, onClose }: TaskModalProps) => {
  const t = useTranslations();
  const schema = useMemo(() => getTaskSchema(t), [t]);
  const phases = useWeddingPlannerTimeline(eventId).data ?? [];
  const createTodo = useCreateTodo(eventId);
  const updateTodo = useUpdateTodo(eventId);
  const deleteTodo = useDeleteTodo(eventId);
  const [dateOpen, setDateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFields>({
    defaultValues: emptyDefaults,
    resolver: standardSchemaResolver(schema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) reset(toDefaults(todo));
  }, [open, todo, reset]);

  const saving = createTodo.isPending || updateTodo.isPending;

  const onSubmit = (values: TaskFields) => {
    const costNum = values.cost.trim() ? Number(values.cost) : null;
    const input = {
      title: values.title,
      status: values.status,
      priority: values.priority,
      category: values.category.trim() || null,
      dueDate: values.dueDate || null,
      owner: values.owner.trim() || null,
      cost: costNum != null && !Number.isNaN(costNum) ? costNum : null,
      vendor: values.vendor.trim() || null,
      note: values.note.trim() || null,
      blockedBy: values.blockedBy.trim() || null,
      phaseId: values.phaseId === "none" ? null : values.phaseId,
    };
    if (todo) {
      updateTodo.mutate({ todoId: todo.id, input }, { onSuccess: onClose });
    } else {
      createTodo.mutate(input, { onSuccess: onClose });
    }
  };

  const handleDelete = () => {
    if (todo) deleteTodo.mutate(todo.id, { onSuccess: onClose });
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-foreground/40 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-50 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="bg-card rounded-16 data-[state=closed]:animate-scale-fade-out data-[state=open]:animate-scale-fade-in fixed top-1/2 left-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden shadow-lg"
        >
          <Dialog.Title className="type-h3 border-border border-b p-5 font-serif">
            {todo ? t("wp__tasks__modal_edit") : t("wp__tasks__modal_new")}
          </Dialog.Title>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
            noValidate
          >
            <div className="flex flex-col gap-4 overflow-y-auto p-5">
              <label className="flex flex-col gap-1.5">
                <span className="type-caption text-muted-foreground">
                  {t("wp__tasks__f_title")}
                </span>
                <Input
                  type="text"
                  placeholder={t("wp__tasks__f_title_ph")}
                  aria-invalid={Boolean(errors.title)}
                  {...register("title")}
                />
                {errors.title ? (
                  <span className="type-caption text-destructive">
                    {errors.title.message}
                  </span>
                ) : null}
              </label>

              <div className="flex flex-col gap-1.5">
                <span className="type-caption text-muted-foreground">
                  {t("wp__tasks__f_phase")}
                </span>
                <Controller
                  control={control}
                  name="phaseId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          {t("wp__tasks__phase_none")}
                        </SelectItem>
                        {phases.map((phase) => (
                          <SelectItem key={phase.id} value={phase.id}>
                            {phase.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground">
                    {t("wp__tasks__f_status")}
                  </span>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(value as TodoStatus)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">
                            {t("wp__tasks__col_todo")}
                          </SelectItem>
                          <SelectItem value="inprogress">
                            {t("wp__tasks__col_inprogress")}
                          </SelectItem>
                          <SelectItem value="done">
                            {t("wp__tasks__col_done")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground">
                    {t("wp__tasks__f_priority")}
                  </span>
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          field.onChange(value as TodoPriority)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">
                            {t("wp__tasks__p_high")}
                          </SelectItem>
                          <SelectItem value="Medium">
                            {t("wp__tasks__p_medium")}
                          </SelectItem>
                          <SelectItem value="Low">
                            {t("wp__tasks__p_low")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground">
                    {t("wp__tasks__f_category")}
                  </span>
                  <Input type="text" {...register("category")} />
                </label>
                <div className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground">
                    {t("wp__tasks__f_due")}
                  </span>
                  <Controller
                    control={control}
                    name="dueDate"
                    render={({ field }) => {
                      const selected = parseIsoDate(field.value);
                      return (
                        <Popover open={dateOpen} onOpenChange={setDateOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="border-border bg-background text-foreground focus-visible:ring-ring hover:border-primary/40 flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                            >
                              <CalendarIcon
                                width={16}
                                height={16}
                                className="text-primary shrink-0"
                              />
                              <span
                                className={cn(
                                  "type-body-small min-w-0 flex-1 truncate",
                                  selected
                                    ? "font-medium"
                                    : "text-muted-foreground",
                                )}
                              >
                                {selected
                                  ? selected.toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })
                                  : t("wp__tasks__f_due_ph")}
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            sideOffset={8}
                            className="rounded-16 w-auto p-3"
                          >
                            <Calendar
                              mode="single"
                              selected={selected}
                              onSelect={(date) => {
                                field.onChange(date ? toIsoDate(date) : "");
                                setDateOpen(false);
                              }}
                              className="mx-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground flex items-center gap-1.5">
                    {t("wp__tasks__f_owner")}
                    <FieldHint
                      ariaLabel={t("wp__tasks__f_owner")}
                      text={t("wp__tasks__hint_owner")}
                    />
                  </span>
                  <Input type="text" {...register("owner")} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground flex items-center gap-1.5">
                    {t("wp__tasks__f_cost")}
                    <FieldHint
                      ariaLabel={t("wp__tasks__f_cost")}
                      text={t("wp__tasks__hint_cost")}
                    />
                  </span>
                  <Input type="number" min={0} {...register("cost")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground flex items-center gap-1.5">
                    {t("wp__tasks__f_vendor")}
                    <FieldHint
                      ariaLabel={t("wp__tasks__f_vendor")}
                      text={t("wp__tasks__hint_vendor")}
                    />
                  </span>
                  <Input type="text" {...register("vendor")} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="type-caption text-muted-foreground flex items-center gap-1.5">
                    {t("wp__tasks__f_blocked")}
                    <FieldHint
                      ariaLabel={t("wp__tasks__f_blocked")}
                      text={t("wp__tasks__hint_blocked")}
                    />
                  </span>
                  <Input type="text" {...register("blockedBy")} />
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="type-caption text-muted-foreground">
                  {t("wp__tasks__f_note")}
                </span>
                <textarea
                  rows={3}
                  {...register("note")}
                  className="border-border bg-background text-foreground type-body-small w-full rounded-lg border p-3 leading-relaxed outline-none"
                />
              </label>
            </div>

            <div className="border-border flex items-center justify-between gap-2 border-t p-5">
              {todo ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <TrashIcon width={16} height={16} />
                  {t("wp__tasks__delete")}
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button type="button" variant="pillGhost" onClick={onClose}>
                  {t("wp__tasks__cancel")}
                </Button>
                <Button type="submit" disabled={saving}>
                  {t("wp__tasks__save")}
                </Button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
