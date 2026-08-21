export const EVENT_TYPES = [
  "wedding",
  "birthday",
  "corporate",
  "baby_shower",
  "anniversary",
  "memorial",
  "graduation",
  "other",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const DEFAULT_EVENT_TYPE: EventType = "wedding";

export type FieldKind =
  | "text"
  | "longtext"
  | "date"
  | "int"
  | "select"
  | "people"
  | "url"
  | "image"
  | "file";

export type FieldStorage = "column" | "details";

export type EventColumn =
  | "hostAName"
  | "hostBName"
  | "eventDate"
  | "endDate"
  | "locationName"
  | "locationCity"
  | "expectedGuests"
  | "welcomeMessage";

export type FieldOption = {
  value: string;
  labelKey: string;
};

export type FieldDef = {
  key: string;
  kind: FieldKind;
  storage: FieldStorage;
  column?: EventColumn;
  required?: boolean;
  labelKey: string;
  placeholderKey?: string;
  min?: number;
  max?: number;
  options?: FieldOption[];
};

export type GuestStep =
  | "landing"
  | "record"
  | "compose"
  | "rsvp"
  | "tribute"
  | "agenda"
  | "checkin"
  | "review"
  | "thank_you"
  | "gallery";

export type CoreFeature =
  | "invitees"
  | "rsvp"
  | "invitations"
  | "messages"
  | "guestbook"
  | "media"
  | "keepsakes"
  | "planner"
  | "assistant"
  | "kiosk"
  | "link"
  | "countdown";

export type SchedulerReminderKind =
  | "week_before"
  | "day_of"
  | "post_event_summary";

/**
 * The web-side event-type config: the serializable projection of the API
 * registry (no `detailsSchema`/`slugSource`). Drives form rendering, labels,
 * feature gating, and per-type UX. Regenerate the mirror via
 * `scripts/sync-event-types.ts`.
 */
export type EventTypeConfig = {
  type: EventType;
  nounKeys: {
    event: string;
    host: string;
    hostPlural?: string;
    guest: string;
    dateLabel: string;
  };
  customNoun?: boolean;
  fields: FieldDef[];
  features: Record<CoreFeature, boolean>;
  rsvp: {
    enabled: boolean;
    capacity: boolean;
    waitlist: boolean;
    customQuestions: boolean;
  };
  guestFlow: { steps: GuestStep[] };
  templates: {
    invitation: { setId: string; defaultId: string };
    cover: { setId: string; defaultId: string };
  };
  planner: {
    enabled: boolean;
    phaseTemplateId: string | null;
    budgetCategoriesId: string | null;
    vendorCategoriesId: string | null;
  };
  scheduler: { reminders: SchedulerReminderKind[] };
  privacyDefaults: { moderateMessages: boolean; unlisted: boolean };
};
