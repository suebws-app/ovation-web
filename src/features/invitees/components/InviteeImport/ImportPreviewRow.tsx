"use client";

import { cn } from "@ovation/ui/utils/cn";
import type { ImportColumnRole, ImportRowDraft } from "../inviteeImportParser";
import { isValidDraft } from "../inviteeImportParser";
import { getDraftCellValue } from "./utils";

type ImportPreviewRowProps = {
  draft: ImportRowDraft;
  mapping: ImportColumnRole[];
};

export const ImportPreviewRow = ({ draft, mapping }: ImportPreviewRowProps) => (
  <tr
    className={cn(
      "border-border border-b",
      !isValidDraft(draft) && "bg-destructive/5",
    )}
  >
    {mapping.map((role, index) => (
      <td key={index} className="px-3 py-2">
        {getDraftCellValue(draft, role)}
      </td>
    ))}
  </tr>
);
