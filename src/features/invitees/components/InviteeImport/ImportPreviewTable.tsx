"use client";

import type { ImportColumnRole, ImportRowDraft } from "../inviteeImportParser";
import { MAX_PREVIEW_ROWS } from "./constants";
import { ImportPreviewRow } from "./ImportPreviewRow";

type ImportPreviewTableProps = {
  drafts: ImportRowDraft[];
  mapping: ImportColumnRole[];
};

export const ImportPreviewTable = ({
  drafts,
  mapping,
}: ImportPreviewTableProps) => {
  const visibleDrafts = drafts.slice(0, MAX_PREVIEW_ROWS);

  return (
    <div className="flex-1 overflow-y-auto">
      <table className="type-body-small w-full">
        <tbody>
          {visibleDrafts.map((draft, index) => (
            <ImportPreviewRow key={index} draft={draft} mapping={mapping} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
