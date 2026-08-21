"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { PlusIcon } from "@ovation/icons/PlusIcon";
import { TrashIcon } from "@ovation/icons/TrashIcon";
import { ViewHeader } from "../components/ViewHeader";
import {
  useWeddingPlannerTasks,
  useDeleteAllTodos,
} from "@/lib/query/weddingPlannerQueries";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "@/components/Toaster";
import type { PlannerTodo } from "@/lib/api/types";
import { TaskBoard } from "./TaskBoard";
import { TaskModal } from "./TaskModal";

export const WeddingPlannerTasksClient = ({ eventId }: { eventId: string }) => {
  const t = useTranslations();
  const { data: todos, isLoading, isError } = useWeddingPlannerTasks(eventId);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTodo, setActiveTodo] = useState<PlannerTodo | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteAll = useDeleteAllTodos(eventId);
  const hasTodos = Boolean(todos && todos.length > 0);

  const confirmDeleteAll = () =>
    deleteAll.mutate(undefined, {
      onSuccess: () => {
        toast.success(t("wp__tasks__delete_all_done"));
        setConfirmOpen(false);
      },
      onError: () => toast.error(t("wp__tasks__delete_all_error")),
    });

  const openCreate = () => {
    setActiveTodo(null);
    setModalOpen(true);
  };
  const openEdit = (todo: PlannerTodo) => {
    setActiveTodo(todo);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const renderBody = () => {
    if (isLoading) {
      return (
        <p className="type-body-small text-muted-foreground">
          {t("wp__tasks__loading")}
        </p>
      );
    }
    if (isError) {
      return (
        <p className="type-body-small text-destructive">
          {t("wp__tasks__error")}
        </p>
      );
    }
    if (!todos || todos.length === 0) {
      return (
        <div className="rounded-16 border-border flex flex-col items-center gap-4 border border-dashed p-10 text-center">
          <p className="type-h4">{t("wp__tasks__empty_title")}</p>
          <p className="type-body-small text-muted-foreground max-w-md">
            {t("wp__tasks__empty_body")}
          </p>
          <Button size="sm" onClick={openCreate}>
            <PlusIcon width={15} height={15} />
            {t("wp__tasks__new")}
          </Button>
        </div>
      );
    }
    return <TaskBoard eventId={eventId} todos={todos} onOpen={openEdit} />;
  };

  return (
    <div>
      <ViewHeader
        title={t("wp__tasks__title")}
        subtitle={t("wp__tasks__sub")}
        action={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmOpen(true)}
              disabled={!hasTodos}
            >
              <TrashIcon width={15} height={15} />
              {t("wp__tasks__delete_all")}
            </Button>
            <Button size="sm" onClick={openCreate}>
              <PlusIcon width={15} height={15} />
              {t("wp__tasks__new")}
            </Button>
          </>
        }
      />
      {renderBody()}
      <TaskModal
        eventId={eventId}
        open={modalOpen}
        todo={activeTodo}
        onClose={closeModal}
      />
      <ConfirmDialog
        open={confirmOpen}
        title={t("wp__tasks__delete_all_title")}
        description={t("wp__tasks__delete_all_desc")}
        cancelLabel={t("wp__tasks__cancel")}
        confirmLabel={t("wp__tasks__delete_all")}
        confirmTone="destructive"
        isPending={deleteAll.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDeleteAll}
      />
    </div>
  );
};
