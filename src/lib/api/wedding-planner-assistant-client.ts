import { clientEnv as env } from "@/lib/utils/env.client";
import { API_BASE_PATH, clientFetch } from "./client";
import { getCsrfToken, invalidateCsrfToken } from "./csrf-token";
import type {
  AssistantAppliedAction,
  AssistantMessage,
  AssistantMode,
  AssistantProposedAction,
} from "./types";

const base = (eventId: string) => `/events/${eventId}/planner/assistant`;

export type AssistantHistoryPage = {
  messages: AssistantMessage[];
  hasMore: boolean;
};

export const getAssistantMessages = (
  eventId: string,
  params?: { before?: string; limit?: number },
) => {
  const query = new URLSearchParams();
  if (params?.before) query.set("before", params.before);
  if (params?.limit) query.set("limit", String(params.limit));
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return clientFetch<AssistantHistoryPage>(
    `${base(eventId)}/messages${suffix}`,
  );
};

export const applyAssistantActions = (
  eventId: string,
  input: {
    messageId: string;
    actions: { tool: string; args: Record<string, unknown> }[];
  },
) =>
  clientFetch<{ applied: AssistantAppliedAction[] }>(`${base(eventId)}/apply`, {
    method: "POST",
    body: input,
  });

export const undoAssistantActions = (
  eventId: string,
  input: { messageId: string },
) =>
  clientFetch<void>(`${base(eventId)}/undo`, { method: "POST", body: input });

export const createStarterPlan = (eventId: string) =>
  clientFetch<{ message: AssistantMessage }>(`${base(eventId)}/starter`, {
    method: "POST",
  });

export const clearAssistant = (eventId: string) =>
  clientFetch<void>(`${base(eventId)}/messages`, { method: "DELETE" });

export type AssistantStreamHandlers = {
  onToken?: (text: string) => void;
  onPropose?: (proposal: { tool: string; summary: string }) => void;
  onDone?: (result: {
    messageId: string;
    proposedActions: AssistantProposedAction[];
  }) => void;
  onError?: (message: string) => void;
};

const streamUrl = (eventId: string) =>
  `${env.API_URL}${API_BASE_PATH}${base(eventId)}/stream`;

export const streamAssistant = async (
  eventId: string,
  input: { message: string; mode: AssistantMode; locale: string },
  handlers: AssistantStreamHandlers,
  signal?: AbortSignal,
): Promise<void> => {
  const send = (token: string) =>
    fetch(streamUrl(eventId), {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        "X-CSRF-Token": token,
      },
      body: JSON.stringify(input),
    });

  let res: Response;
  try {
    res = await send(await getCsrfToken());
    if (res.status === 403) {
      invalidateCsrfToken();
      res = await send(await getCsrfToken());
    }
  } catch {
    handlers.onError?.("network");
    return;
  }

  if (!res.ok || !res.body) {
    handlers.onError?.("request_failed");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const handleFrame = (frame: string) => {
    let eventName = "message";
    let data = "";
    for (const line of frame.split("\n")) {
      if (line.startsWith("event:")) eventName = line.slice(6).trim();
      else if (line.startsWith("data:")) data += line.slice(5).trim();
    }
    if (!data) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      return;
    }
    const obj = parsed as Record<string, unknown>;
    if (eventName === "token") handlers.onToken?.(String(obj.text ?? ""));
    else if (eventName === "propose")
      handlers.onPropose?.({
        tool: String(obj.tool ?? ""),
        summary: String(obj.summary ?? ""),
      });
    else if (eventName === "done")
      handlers.onDone?.({
        messageId: String(obj.messageId ?? ""),
        proposedActions: Array.isArray(obj.proposedActions)
          ? (obj.proposedActions as AssistantProposedAction[])
          : [],
      });
    else if (eventName === "error")
      handlers.onError?.(String(obj.message ?? "error"));
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) handleFrame(frame);
  }
};
