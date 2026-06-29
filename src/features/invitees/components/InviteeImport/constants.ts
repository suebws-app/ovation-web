export const ACCEPTED_FILE_TYPES =
  ".csv,.tsv,text/csv,text/tab-separated-values";

export const MAX_PREVIEW_ROWS = 100;

export const IMPORT_METHODS = ["paste", "upload"] as const;
export type ImportMethod = (typeof IMPORT_METHODS)[number];
