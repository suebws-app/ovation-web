export type WeddingInfo = {
  partners: string;
  date: string;
  venue: string;
  city: string;
  budgetTotal: number;
  guestTarget: number;
};

export type TaskStatus = "todo" | "inprogress" | "done";
export type TaskPriority = "High" | "Medium" | "Low";

export type WeddingTask = {
  id: string;
  title: string;
  cat: string;
  due: string;
  priority: TaskPriority;
  status: TaskStatus;
  owner: string;
  cost: number;
  vendor?: string;
  note?: string;
  blockedBy?: string;
};

export type BudgetLine = {
  cat: string;
  est: number;
  actual: number;
  paid: number;
};

export type Payment = {
  vendor: string;
  label: string;
  amount: number;
  due: string;
  status: string;
};

export type RsvpStatus = "confirmed" | "pending" | "declined";

export type Guest = {
  id: string;
  name: string;
  group: string;
  side: string;
  rsvp: RsvpStatus;
  meal: string;
  plus1: boolean;
  table: number | null;
};

export type GuestStats = {
  invited: number;
  confirmed: number;
  pending: number;
  declined: number;
};

export type AiRole = "ai" | "user";

export type AiMessage = {
  role: AiRole;
  text: string;
};
