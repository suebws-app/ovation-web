"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { CheckIcon } from "@ovation/icons/CheckIcon";
import type {
  AssistantAppliedAction,
  AssistantProposedAction,
} from "@/lib/api/types";

type AssistantActionPanelProps = {
  proposed?: AssistantProposedAction[];
  applied?: AssistantAppliedAction[] | null;
  undone?: boolean;
  dismissed?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  onUndo: () => void;
};

export const AssistantActionPanel = ({
  proposed,
  applied,
  undone,
  dismissed,
  pending,
  onConfirm,
  onDismiss,
  onUndo,
}: AssistantActionPanelProps) => {
  const t = useTranslations();

  if (undone) {
    return (
      <p className="type-caption text-muted-foreground mt-2">
        {t("wp__ai__reverted")}
      </p>
    );
  }

  if (applied && applied.length > 0) {
    return (
      <div className="rounded-12 border-secondary/40 bg-secondary/15 mt-2 border p-3">
        <p className="type-caption text-secondary-foreground flex items-center gap-1.5 font-semibold">
          <CheckIcon width={14} height={14} />
          {t("wp__ai__changes_made")}
        </p>
        <ul className="mt-1.5 flex flex-col gap-1">
          {applied.map((action) => (
            <li
              key={action.entityId}
              className="type-caption text-muted-foreground"
            >
              • {action.summary}
            </li>
          ))}
        </ul>
        <Button
          size="sm"
          variant="pillGhost"
          className="mt-2"
          onClick={onUndo}
          disabled={pending}
        >
          {t("wp__ai__undo")}
        </Button>
      </div>
    );
  }

  if (proposed && proposed.length > 0 && !dismissed) {
    return (
      <div className="rounded-12 border-border bg-card mt-2 border p-3">
        <p className="type-caption text-muted-foreground font-semibold">
          {t("wp__ai__propose_title")}
        </p>
        <ul className="mt-1.5 flex flex-col gap-1">
          {proposed.map((action, index) => (
            <li key={index} className="type-body-small">
              • {action.summary}
            </li>
          ))}
        </ul>
        <div className="mt-2.5 flex gap-2">
          <Button size="sm" onClick={onConfirm} disabled={pending}>
            {t("wp__ai__confirm")}
          </Button>
          <Button
            size="sm"
            variant="pillGhost"
            onClick={onDismiss}
            disabled={pending}
          >
            {t("wp__ai__dismiss")}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
