"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@ovation/ui/utils/cn";
import { Card } from "@ovation/ui/components/Card";
import { Button } from "@ovation/ui/components/Button";
import { SendIcon } from "@ovation/icons/SendIcon";
import { SparkleIcon } from "@ovation/icons/SparkleIcon";
import { ChevronDownIcon } from "@ovation/icons/ChevronDownIcon";
import { TrashIcon } from "@ovation/icons/TrashIcon";
import { ViewHeader } from "../components/ViewHeader";
import { FieldHint } from "../components/FieldHint";
import { queryKeys } from "@/lib/query/keys";
import {
  useAssistantMessages,
  useClearAssistant,
} from "@/lib/query/weddingPlannerQueries";
import {
  applyAssistantActions,
  getAssistantMessages,
  streamAssistant,
  undoAssistantActions,
} from "@/lib/api/wedding-planner-assistant-client";
import type { AssistantMessage, AssistantMode } from "@/lib/api/types";
import { AiSuggestionChip } from "./AiSuggestionChip";
import { AssistantTurn, type ChatMessage } from "./AssistantTurn";

const historyToChat = (message: AssistantMessage): ChatMessage => ({
  id: message.id,
  role: message.role,
  content: message.content,
  mode: message.mode ?? undefined,
  proposedActions:
    message.appliedActions && message.appliedActions.length
      ? undefined
      : (message.proposedActions ?? undefined),
  appliedActions: message.appliedActions,
  undone: message.undone,
  createdAt: message.createdAt,
});

const updateById = (
  messages: ChatMessage[],
  id: string,
  updater: (message: ChatMessage) => ChatMessage,
): ChatMessage[] => messages.map((m) => (m.id === id ? updater(m) : m));

export const WeddingPlannerAssistantClient = ({
  eventId,
}: {
  eventId: string;
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { data: history } = useAssistantMessages(eventId);
  const clearChat = useClearAssistant(eventId);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const mapped = (history?.messages ?? []).map(historyToChat);
    return mapped.length
      ? mapped
      : [{ id: "greeting", role: "assistant", content: t("wp__ai__hello") }];
  });
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<AssistantMode>("plan");
  const [streaming, setStreaming] = useState(false);
  const [actionPending, setActionPending] = useState(false);
  const [hasMore, setHasMore] = useState(history?.hasMore ?? false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [planAskPending, setPlanAskPending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const wasStreaming = useRef(false);

  const lastMessage = messages[messages.length - 1];
  const scrollSignature = `${lastMessage?.id ?? ""}:${lastMessage?.content.length ?? 0}`;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [scrollSignature]);

  useEffect(() => {
    if (wasStreaming.current && !streaming) inputRef.current?.focus();
    wasStreaming.current = streaming;
  }, [streaming]);

  const loadEarlier = async () => {
    if (loadingMore || !hasMore) return;
    const oldest = messages.find((message) => message.createdAt)?.createdAt;
    if (!oldest) return;
    setLoadingMore(true);
    const container = scrollRef.current;
    const prevHeight = container?.scrollHeight ?? 0;
    const prevTop = container?.scrollTop ?? 0;
    try {
      const page = await getAssistantMessages(eventId, { before: oldest });
      const older = page.messages.map(historyToChat);
      setMessages((prev) => [...older, ...prev]);
      setHasMore(page.hasMore);
      requestAnimationFrame(() => {
        const node = scrollRef.current;
        if (node) node.scrollTop = prevTop + (node.scrollHeight - prevHeight);
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const runStream = async (
    aiId: string,
    value: string,
    currentMode: AssistantMode,
  ) => {
    setStreaming(true);
    await streamAssistant(
      eventId,
      { message: value, mode: currentMode, locale },
      {
        onToken: (tk) =>
          setMessages((prev) =>
            updateById(prev, aiId, (m) => ({ ...m, content: m.content + tk })),
          ),
        onDone: ({ messageId, proposedActions }) =>
          setMessages((prev) =>
            updateById(prev, aiId, (m) => ({
              ...m,
              id: messageId || m.id,
              streaming: false,
              error: false,
              failedPrompt: undefined,
              failedMode: undefined,
              proposedActions: proposedActions.length
                ? proposedActions
                : undefined,
            })),
          ),
        onError: () =>
          setMessages((prev) =>
            updateById(prev, aiId, (m) => ({
              ...m,
              streaming: false,
              error: true,
              failedPrompt: value,
              failedMode: currentMode,
              content: m.content || t("wp__ai__error"),
            })),
          ),
      },
    );

    setStreaming(false);
    queryClient.invalidateQueries({
      queryKey: queryKeys.weddingPlanner.assistant(eventId),
    });
  };

  const send = async (text: string, overrideMode?: AssistantMode) => {
    const value = text.trim();
    if (!value || streaming) return;
    setPlanAskPending(false);
    const aiId = crypto.randomUUID();
    const currentMode = overrideMode ?? mode;
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: value,
        mode: currentMode,
      },
      { id: aiId, role: "assistant", content: "", streaming: true },
    ]);
    setInput("");
    await runStream(aiId, value, currentMode);
  };

  const retry = (message: ChatMessage) => {
    if (streaming || !message.failedPrompt) return;
    const value = message.failedPrompt;
    const retryMode = message.failedMode ?? mode;
    setMessages((prev) =>
      updateById(prev, message.id, (m) => ({
        ...m,
        content: "",
        streaming: true,
        error: false,
      })),
    );
    void runStream(message.id, value, retryMode);
  };

  const confirm = async (message: ChatMessage) => {
    if (!message.proposedActions?.length || actionPending) return;
    setActionPending(true);
    try {
      const { applied } = await applyAssistantActions(eventId, {
        messageId: message.id,
        actions: message.proposedActions.map((p) => ({
          tool: p.tool,
          args: p.args,
        })),
      });
      setMessages((prev) =>
        updateById(prev, message.id, (m) => ({
          ...m,
          appliedActions: applied,
          proposedActions: undefined,
        })),
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      });
    } finally {
      setActionPending(false);
    }
  };

  const dismiss = (message: ChatMessage) =>
    setMessages((prev) =>
      updateById(prev, message.id, (m) => ({ ...m, dismissed: true })),
    );

  const undo = async (message: ChatMessage) => {
    if (!message.appliedActions?.length || actionPending) return;
    setActionPending(true);
    try {
      await undoAssistantActions(eventId, { messageId: message.id });
      setMessages((prev) =>
        updateById(prev, message.id, (m) => ({ ...m, undone: true })),
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.weddingPlanner.all(eventId),
      });
    } finally {
      setActionPending(false);
    }
  };

  const onClearChat = () => {
    if (streaming || actionPending || clearChat.isPending) return;
    clearChat.mutate(undefined, {
      onSuccess: () => {
        setMessages([
          { id: "greeting", role: "assistant", content: t("wp__ai__hello") },
        ]);
        setHasMore(false);
        setShowSuggestions(true);
        setPlanAskPending(false);
      },
    });
  };

  const hasConversation = messages.length > 1 || messages[0]?.id !== "greeting";

  const generateFullPlan = () => {
    if (streaming || actionPending) return;
    setMode("action");
    void send(t("wp__ai__plan_prompt"), "action");
    setPlanAskPending(true);
  };

  const decideForMe = () => {
    if (streaming || actionPending) return;
    setMode("action");
    void send(t("wp__ai__decide_prompt"), "action");
  };

  const starters = [
    t("wp__ai__starter_1"),
    t("wp__ai__starter_2"),
    t("wp__ai__starter_3"),
  ];

  return (
    <div>
      <ViewHeader
        title={t("wp__ai__title")}
        subtitle={t("wp__ai__sub")}
        action={
          <Button
            type="button"
            variant="pillGhost"
            size="sm"
            onClick={onClearChat}
            disabled={
              !hasConversation ||
              streaming ||
              actionPending ||
              clearChat.isPending
            }
          >
            <TrashIcon width={15} height={15} />
            {t("wp__ai__clear")}
          </Button>
        }
      />
      <Card className="flex flex-col overflow-hidden p-0">
        <div
          ref={scrollRef}
          className="flex flex-col gap-4 overflow-y-auto p-6"
          style={{ height: 520 }}
        >
          {hasMore ? (
            <button
              type="button"
              onClick={loadEarlier}
              disabled={loadingMore}
              className="type-caption text-muted-foreground hover:text-foreground mx-auto rounded-lg px-3 py-1 font-semibold transition-colors disabled:opacity-60"
            >
              {loadingMore
                ? t("wp__ai__loading_earlier")
                : t("wp__ai__load_earlier")}
            </button>
          ) : null}
          {messages.map((message) => (
            <AssistantTurn
              key={message.id}
              message={message}
              actionPending={actionPending}
              onConfirm={confirm}
              onDismiss={dismiss}
              onUndo={undo}
              onRetry={retry}
            />
          ))}
          <div ref={endRef} />
        </div>

        <div className="border-border border-t p-4">
          <button
            type="button"
            onClick={() => setShowSuggestions((value) => !value)}
            aria-expanded={showSuggestions}
            className="type-caption text-muted-foreground hover:text-foreground mb-2 flex items-center gap-1 font-semibold transition-colors"
          >
            {t("wp__ai__suggestions")}
            <ChevronDownIcon
              width={14}
              height={14}
              className={cn(
                "transition-transform duration-200",
                showSuggestions && "rotate-180",
              )}
            />
          </button>
          {showSuggestions ? (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {starters.map((starter) => (
                  <AiSuggestionChip
                    key={starter}
                    label={starter}
                    onClick={() => send(starter)}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="pillGhost"
                size="sm"
                className="mt-2 w-full"
                onClick={generateFullPlan}
                disabled={streaming || actionPending}
              >
                <SparkleIcon width={15} height={15} />
                {t("wp__ai__generate_plan")}
              </Button>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <div className="border-border bg-muted/30 relative grid grid-cols-2 rounded-full border">
              <span
                aria-hidden
                className={cn(
                  "bg-primary absolute inset-y-0 left-0 w-1/2 rounded-full shadow-sm transition-transform duration-200 ease-out",
                  mode === "action" && "translate-x-full",
                )}
              />
              <button
                type="button"
                onClick={() => setMode("plan")}
                className={cn(
                  "type-caption relative z-10 rounded-full px-3 py-1.5 font-semibold transition-colors",
                  mode === "plan"
                    ? "text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                {t("wp__ai__mode_plan")}
              </button>
              <button
                type="button"
                onClick={() => setMode("action")}
                className={cn(
                  "type-caption relative z-10 rounded-full px-3 py-1.5 font-semibold transition-colors",
                  mode === "action"
                    ? "text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                {t("wp__ai__mode_action")}
              </button>
            </div>
            <FieldHint
              ariaLabel={t("wp__ai__mode_hint_label")}
              text={t("wp__ai__mode_hint")}
            />
          </div>
          {planAskPending && !streaming ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AiSuggestionChip
                label={t("wp__ai__decide_for_me")}
                onClick={decideForMe}
              />
            </div>
          ) : null}
          <div className="mt-2 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder={t("wp__ai__placeholder")}
              disabled={streaming}
              className="border-border bg-card type-body-small max-h-32 flex-1 resize-none rounded-2xl border px-4 py-3 outline-none"
            />
            <Button
              type="button"
              size="icon"
              className="rounded-full"
              onClick={() => send(input)}
              disabled={streaming || !input.trim()}
              aria-label={t("wp__ai__send")}
            >
              <SendIcon width={16} height={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
