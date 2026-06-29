"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  buildDrafts,
  draftsToInvitees,
  inferColumnMapping,
  isValidDraft,
  parseDelimited,
  type ImportColumnRole,
  type ImportInvitee,
  type ParseResult,
} from "../inviteeImportParser";
import { type ImportMethod } from "./constants";
import { ImportFileDropZone } from "./ImportFileDropZone";
import { ImportFooter } from "./ImportFooter";
import { ImportMethodSwitch } from "./ImportMethodSwitch";
import { ImportParseFooter } from "./ImportParseFooter";
import { ImportPasteForm } from "./ImportPasteForm";
import { ImportPreviewView } from "./ImportPreviewView";

type UseInviteeImportArgs = {
  onConfirm: (invitees: ImportInvitee[]) => Promise<void> | void;
  isSubmitting: boolean;
};

type UseInviteeImportResult = {
  body: ReactNode;
  footer: ReactNode | null;
};

const initialMapping: ImportColumnRole[] = [];

export const useInviteeImport = ({
  onConfirm,
  isSubmitting,
}: UseInviteeImportArgs): UseInviteeImportResult => {
  const [method, setMethod] = useState<ImportMethod>("paste");
  const [pasteValue, setPasteValue] = useState("");
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [hasHeader, setHasHeader] = useState(true);
  const [mapping, setMapping] = useState<ImportColumnRole[]>(initialMapping);

  const dataRows = useMemo(() => {
    if (!parseResult) return [];
    return hasHeader ? parseResult.rows.slice(1) : parseResult.rows;
  }, [parseResult, hasHeader]);

  const drafts = useMemo(
    () => buildDrafts(dataRows, mapping),
    [dataRows, mapping],
  );

  const { validCount, invalidCount } = useMemo(() => {
    const valid = drafts.filter(isValidDraft).length;
    return { validCount: valid, invalidCount: drafts.length - valid };
  }, [drafts]);

  const parse = (raw: string) => {
    const result = parseDelimited(raw);
    const columnCount = result.rows[0]?.length ?? 0;
    const headerRow = result.hasHeader ? result.rows[0] : undefined;
    setParseResult(result);
    setHasHeader(result.hasHeader);
    setMapping(inferColumnMapping(headerRow, columnCount));
  };

  const reset = () => {
    setPasteValue("");
    setParseResult(null);
    setMapping(initialMapping);
    setHasHeader(true);
  };

  const handlePasteParse = () => {
    if (!pasteValue.trim()) return;
    parse(pasteValue);
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    setPasteValue(text);
    parse(text);
  };

  const handleConfirm = async () => {
    const invitees = draftsToInvitees(drafts);
    if (invitees.length === 0) return;
    await onConfirm(invitees);
    reset();
  };

  if (!parseResult) {
    const isPaste = method === "paste";
    return {
      body: (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <ImportMethodSwitch method={method} onChange={setMethod} />
          {isPaste ? (
            <ImportPasteForm value={pasteValue} onChange={setPasteValue} />
          ) : (
            <ImportFileDropZone onFile={handleFile} />
          )}
        </div>
      ),
      footer: isPaste ? (
        <ImportParseFooter
          canParse={pasteValue.trim().length > 0}
          onParse={handlePasteParse}
        />
      ) : null,
    };
  }

  return {
    body: (
      <ImportPreviewView
        hasHeader={hasHeader}
        mapping={mapping}
        drafts={drafts}
        onHeaderChange={setHasHeader}
        onReset={reset}
      />
    ),
    footer: (
      <ImportFooter
        validCount={validCount}
        invalidCount={invalidCount}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirm}
      />
    ),
  };
};
