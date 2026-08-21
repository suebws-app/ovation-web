import { EVENT_TYPE_CONFIGS } from "./generated";
import {
  DEFAULT_EVENT_TYPE,
  type EventType,
  type EventTypeConfig,
} from "./types";

const BY_TYPE: Record<string, EventTypeConfig> = Object.fromEntries(
  EVENT_TYPE_CONFIGS.map((config) => [config.type, config]),
);

/**
 * Resolve the config for an event type. Unknown types fall back to the wedding
 * config so callers always get a usable config (mirrors the API behavior).
 */
export const getEventTypeConfig = (
  type: string | null | undefined,
): EventTypeConfig => {
  if (type && BY_TYPE[type]) return BY_TYPE[type];
  return BY_TYPE[DEFAULT_EVENT_TYPE];
};

export const listEventTypes = (): EventTypeConfig[] => EVENT_TYPE_CONFIGS;

export const isEventType = (
  type: string | null | undefined,
): type is EventType => Boolean(type && BY_TYPE[type]);
