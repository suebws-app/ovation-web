import Papa from "papaparse";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s().-]{2,}$/;

export type ImportColumnRole =
  | "ignore"
  | "firstName"
  | "email"
  | "phone"
  | "seats";

export type ImportRowDraft = {
  firstName: string;
  email: string;
  phone: string;
  seats: number;
  errors: {
    firstName?: string;
    email?: string;
    phone?: string;
    seats?: string;
  };
};

export type ParseResult = {
  rows: string[][];
  hasHeader: boolean;
};

const HEADER_HINTS = [
  "name",
  "first",
  "first name",
  "firstname",
  "guest",
  "email",
  "e-mail",
  "phone",
  "mobile",
  "tel",
  "telephone",
  "seats",
  "tickets",
  "+1",
];

const FIRST_NAME_HEADERS = [
  "name",
  "first",
  "first name",
  "firstname",
  "guest",
  "guest name",
];

const EMAIL_HEADERS = ["email", "e-mail", "mail"];

const PHONE_HEADERS = [
  "phone",
  "phone number",
  "mobile",
  "mobile number",
  "tel",
  "telephone",
  "cell",
  "whatsapp",
];

const SEATS_HEADERS = ["seats", "tickets", "+1", "guests", "party size"];

export const parseDelimited = (input: string): ParseResult => {
  const result = Papa.parse<string[]>(input.trim(), {
    skipEmptyLines: "greedy",
  });
  const rows = result.data.filter((row) =>
    row.some((cell) => cell.trim().length > 0),
  );
  const hasHeader = detectHeader(rows[0]);
  return { rows, hasHeader };
};

const detectHeader = (firstRow?: string[]): boolean => {
  if (!firstRow) return false;
  const lowered = firstRow.map((cell) => cell.toLowerCase().trim());
  return lowered.some((cell) => HEADER_HINTS.includes(cell));
};

export const inferColumnMapping = (
  header: string[] | undefined,
  columnCount: number,
): ImportColumnRole[] => {
  const mapping: ImportColumnRole[] = Array(columnCount).fill("ignore");
  if (!header) {
    if (columnCount > 0) mapping[0] = "firstName";
    if (columnCount > 1) mapping[1] = "email";
    if (columnCount > 2) mapping[2] = "phone";
    if (columnCount > 3) mapping[3] = "seats";
    return mapping;
  }
  header.forEach((cell, idx) => {
    const lowered = cell.toLowerCase().trim();
    if (
      mapping.indexOf("firstName") === -1 &&
      FIRST_NAME_HEADERS.includes(lowered)
    ) {
      mapping[idx] = "firstName";
    } else if (
      mapping.indexOf("email") === -1 &&
      EMAIL_HEADERS.includes(lowered)
    ) {
      mapping[idx] = "email";
    } else if (
      mapping.indexOf("phone") === -1 &&
      PHONE_HEADERS.includes(lowered)
    ) {
      mapping[idx] = "phone";
    } else if (
      mapping.indexOf("seats") === -1 &&
      SEATS_HEADERS.includes(lowered)
    ) {
      mapping[idx] = "seats";
    }
  });
  if (mapping.indexOf("firstName") === -1 && columnCount > 0) {
    mapping[0] = "firstName";
  }
  return mapping;
};

export const buildDrafts = (
  dataRows: string[][],
  mapping: ImportColumnRole[],
): ImportRowDraft[] =>
  dataRows.map((row) => {
    const draft: ImportRowDraft = {
      firstName: "",
      email: "",
      phone: "",
      seats: 1,
      errors: {},
    };
    mapping.forEach((role, idx) => {
      const value = (row[idx] ?? "").trim();
      if (role === "firstName") draft.firstName = value;
      else if (role === "email") draft.email = value;
      else if (role === "phone") draft.phone = value;
      else if (role === "seats") {
        const parsed = parseInt(value, 10);
        if (Number.isFinite(parsed) && parsed > 0) draft.seats = parsed;
      }
    });
    if (!draft.firstName) draft.errors.firstName = "required";
    if (draft.email && !EMAIL_RE.test(draft.email))
      draft.errors.email = "invalid";
    if (draft.phone && !PHONE_RE.test(draft.phone))
      draft.errors.phone = "invalid";
    if (draft.seats < 1 || draft.seats > 20) draft.errors.seats = "range";
    return draft;
  });

export const isValidDraft = (draft: ImportRowDraft): boolean =>
  Object.keys(draft.errors).length === 0;

export type ImportInvitee = {
  firstName: string;
  email: string | undefined;
  phone: string | undefined;
  seats: number;
};

export const draftsToInvitees = (drafts: ImportRowDraft[]): ImportInvitee[] =>
  drafts.filter(isValidDraft).map((draft) => ({
    firstName: draft.firstName,
    email: draft.email || undefined,
    phone: draft.phone || undefined,
    seats: draft.seats,
  }));
