"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { TrashIcon } from "@ovation/icons/TrashIcon";
import { ViewHeader } from "../components/ViewHeader";
import {
  useCreatePhase,
  useCreateTodo,
  useDeletePhase,
  useDeleteAllPhases,
  useUpdatePhase,
  useWeddingPlannerTasks,
  useWeddingPlannerTimeline,
} from "@/lib/query/weddingPlannerQueries";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "@/components/Toaster";
import type { PlannerTodo } from "@/lib/api/types";
import { AddPhaseRow } from "./AddPhaseRow";
import { TimelinePhaseBoard } from "./TimelinePhaseBoard";
import { TaskModal } from "../tasks/TaskModal";

export const WeddingPlannerTimelineClient = ({
  eventId,
}: {
  eventId: string;
}) => {
  const t = useTranslations();
  const phasesQuery = useWeddingPlannerTimeline(eventId);
  const tasksQuery = useWeddingPlannerTasks(eventId);
  const createPhase = useCreatePhase(eventId);
  const updatePhase = useUpdatePhase(eventId);
  const deletePhase = useDeletePhase(eventId);
  const createTodo = useCreateTodo(eventId);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTodo, setActiveTodo] = useState<PlannerTodo | null>(null);

  const openTask = (todo: PlannerTodo) => {
    setActiveTodo(todo);
    setModalOpen(true);
  };
  const onAddPhase = (title: string) => createPhase.mutate({ title });
  const onRenamePhase = (phaseId: string, title: string) =>
    updatePhase.mutate({ phaseId, input: { title } });
  const onRemovePhase = (phaseId: string) => deletePhase.mutate(phaseId);
  const onAddTask = (containerId: string, label: string) =>
    createTodo.mutate({
      title: label,
      phaseId: containerId === "unassigned" ? null : containerId,
    });

  const phases = phasesQuery.data;
  const todos = tasksQuery.data;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteAllPhases = useDeleteAllPhases(eventId);
  const hasPhases = Boolean(phases && phases.length > 0);

  const confirmDeleteAll = () =>
    deleteAllPhases.mutate(undefined, {
      onSuccess: () => {
        toast.success(t("wp__timeline__delete_all_done"));
        setConfirmOpen(false);
      },
      onError: () => toast.error(t("wp__timeline__delete_all_error")),
    });
  const isLoading = phasesQuery.isLoading || tasksQuery.isLoading;
  const isError = phasesQuery.isError || tasksQuery.isError;

  const renderBody = () => {
    if (isLoading) {
      return (
        <p className="type-body-small text-muted-foreground">
          {t("wp__timeline__loading")}
        </p>
      );
    }
    if (isError) {
      return (
        <p className="type-body-small text-destructive">
          {t("wp__timeline__error")}
        </p>
      );
    }
    if (!phases || phases.length === 0) {
      return (
        <div className="rounded-16 border-border flex flex-col items-center gap-4 border border-dashed p-10 text-center">
          <p className="type-h4">{t("wp__timeline__empty_title")}</p>
          <p className="type-body-small text-muted-foreground max-w-md">
            {t("wp__timeline__empty_body")}
          </p>
          <div className="w-full max-w-sm">
            <AddPhaseRow onAdd={onAddPhase} />
          </div>
        </div>
      );
    }
    return (
      <>
        <div className="mb-5">
          <AddPhaseRow onAdd={onAddPhase} />
        </div>
        <TimelinePhaseBoard
          eventId={eventId}
          phases={phases}
          todos={todos ?? []}
          unassignedLabel={t("wp__timeline__unassigned")}
          onOpen={openTask}
          onAddTask={onAddTask}
          onRenamePhase={onRenamePhase}
          onRemovePhase={onRemovePhase}
        />
      </>
    );
  };

  return (
    <div>
      <ViewHeader
        title={t("wp__timeline__title")}
        subtitle={t("wp__timeline__sub")}
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfirmOpen(true)}
            disabled={!hasPhases}
          >
            <TrashIcon width={15} height={15} />
            {t("wp__timeline__delete_all")}
          </Button>
        }
      />
      {renderBody()}
      <TaskModal
        eventId={eventId}
        open={modalOpen}
        todo={activeTodo}
        onClose={() => setModalOpen(false)}
      />
      <ConfirmDialog
        open={confirmOpen}
        title={t("wp__timeline__delete_all_title")}
        description={t("wp__timeline__delete_all_desc")}
        cancelLabel={t("wp__tasks__cancel")}
        confirmLabel={t("wp__timeline__delete_all")}
        confirmTone="destructive"
        isPending={deleteAllPhases.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDeleteAll}
      />
    </div>
  );
};
