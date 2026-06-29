"use client";

import type { ImportColumnRole, ImportRowDraft } from "../inviteeImportParser";
import { ImportPreviewTable } from "./ImportPreviewTable";
import { ImportPreviewToolbar } from "./ImportPreviewToolbar";

type ImportPreviewViewProps = {
  hasHeader: boolean;
  mapping: ImportColumnRole[];
  drafts: ImportRowDraft[];
  onHeaderChange: (value: boolean) => void;
  onReset: () => void;
};

export const ImportPreviewView = ({
  hasHeader,
  mapping,
  drafts,
  onHeaderChange,
  onReset,
}: ImportPreviewViewProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <ImportPreviewToolbar
        hasHeader={hasHeader}
        onHeaderChange={onHeaderChange}
        onReset={onReset}
      />
      <div className="rounded-12 border-border flex min-h-0 flex-1 flex-col overflow-hidden border">
        <ImportPreviewTable drafts={drafts} mapping={mapping} />
      </div>
    </div>
  );
};
