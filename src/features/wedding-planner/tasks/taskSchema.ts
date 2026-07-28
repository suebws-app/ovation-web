import { z } from "zod";

type Translate = (key: string) => string;

export const getTaskSchema = (t: Translate) =>
  z.object({
    title: z.string().trim().min(1, t("wp__tasks__err_title")).max(200),
    status: z.enum(["todo", "inprogress", "done"]),
    priority: z.enum(["High", "Medium", "Low"]),
    category: z.string().trim().max(120),
    dueDate: z.string(),
    owner: z.string().trim().max(120),
    cost: z.string().trim().max(12),
    vendor: z.string().trim().max(120),
    note: z.string().trim().max(2000),
    blockedBy: z.string().trim().max(120),
    phaseId: z.string(),
  });

export type TaskFields = z.infer<ReturnType<typeof getTaskSchema>>;
