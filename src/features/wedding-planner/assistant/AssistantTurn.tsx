"use client";

import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
import { RefreshIcon } from "@ovation/icons/RefreshIcon";
import type {
  AssistantAppliedAction,
  AssistantMode,
  AssistantProposedAction,
} from "@/lib/api/types";
import { AiMessageBubble } from "./AiMessageBubble";
import { AiTypingIndicator } from "./AiTypingIndicator";
import { AssistantActionPanel } from "./AssistantActionPanel";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: AssistantMode;
  proposedActions?: AssistantProposedAction[];
  appliedActions?: AssistantAppliedAction[] | null;
  undone?: boolean;
  dismissed?: boolean;
  streaming?: boolean;
  error?: boolean;
  failedPrompt?: string;
  failedMode?: AssistantMode;
  createdAt?: string;
};

type AssistantTurnProps = {
  message: ChatMessage;
  actionPending: boolean;
  onConfirm: (message: ChatMessage) => void;
  onDismiss: (message: ChatMessage) => void;
  onUndo: (message: ChatMessage) => void;
  onRetry: (message: ChatMessage) => void;
};

export const AssistantTurn = ({
  message,
  actionPending,
  onConfirm,
  onDismiss,
  onUndo,
  onRetry,
}: AssistantTurnProps) => {
  const t = useTranslations();
  const isAssistant = message.role === "assistant";

  if (isAssistant && message.streaming && !message.content) {
    return <AiTypingIndicator />;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isAssistant ? "items-start" : "items-end",
      )}
    >
      {message.role === "user" && message.mode === "action" ? (
        <span className="type-overline text-primary">
          {t("wp__ai__mode_action")}
        </span>
      ) : null}
      <div className="flex w-fit flex-col gap-1">
        <AiMessageBubble
          message={{ role: isAssistant ? "ai" : "user", text: message.content }}
          error={message.error}
        />
        {message.error ? (
          <button
            type="button"
            onClick={() => onRetry(message)}
            className="type-caption text-destructive hover:text-destructive/80 flex items-center gap-1 self-end font-semibold transition-colors"
          >
            <RefreshIcon width={13} height={13} />
            {t("wp__ai__retry")}
          </button>
        ) : null}
      </div>
      {isAssistant ? (
        <div className="w-full max-w-lg">
          <AssistantActionPanel
            proposed={message.proposedActions}
            applied={message.appliedActions}
            undone={message.undone}
            dismissed={message.dismissed}
            pending={actionPending}
            onConfirm={() => onConfirm(message)}
            onDismiss={() => onDismiss(message)}
            onUndo={() => onUndo(message)}
          />
        </div>
      ) : null}
    </div>
  );
};
