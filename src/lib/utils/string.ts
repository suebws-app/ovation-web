export const safeName = (input: string): string =>
  input
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim() || "untitled";
