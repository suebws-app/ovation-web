"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ViewHeader } from "../components/ViewHeader";
import {
  useCreatePhase,
  useCreateTodo,
  useDeletePhase,
  useUpdatePhase,
  useWeddingPlannerTasks,
  useWeddingPlannerTimeline,
} from "@/lib/query/weddingPlannerQueries";
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
      />
      {renderBody()}
      <TaskModal
        eventId={eventId}
        open={modalOpen}
        todo={activeTodo}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
