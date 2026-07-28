"use client";

import { useTranslations } from "next-intl";
import { cn } from "@ovation/ui/utils/cn";
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
  createdAt?: string;
};

type AssistantTurnProps = {
  message: ChatMessage;
  actionPending: boolean;
  onConfirm: (message: ChatMessage) => void;
  onDismiss: (message: ChatMessage) => void;
  onUndo: (message: ChatMessage) => void;
};

export const AssistantTurn = ({
  message,
  actionPending,
  onConfirm,
  onDismiss,
  onUndo,
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
      <AiMessageBubble
        message={{ role: isAssistant ? "ai" : "user", text: message.content }}
      />
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
