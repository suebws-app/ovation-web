"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ovation/ui/components/Button";
import { useRenderStatus } from "@/lib/query/pdfQueries";
import type { RenderStatus } from "@/lib/api/keepsakes-client";
import { XIcon } from "@ovation/icons/XIcon";

type PreviewPdfModalProps = {
  renderId: string | null;
  open: boolean;
  onClose: () => void;
};

type PreviewBodyProps = {
  status: RenderStatus | undefined;
  isLoading: boolean;
  error: Error | null;
};

const PreviewBody = ({ status, isLoading, error }: PreviewBodyProps) => {
  const t = useTranslations();

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="type-body text-destructive">{error.message}</p>
      </div>
    );
  }

  if (
    isLoading ||
    !status ||
    status.status === "queued" ||
    status.status === "rendering"
  ) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        <p className="type-body text-muted-foreground">
          {t("keepsakes__preview_pdf__rendering")}
        </p>
      </div>
    );
  }

  if (status.status === "failed") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="type-body text-destructive">
          {status.errorMessage ?? t("keepsakes__preview_pdf__failed")}
        </p>
      </div>
    );
  }

  return (
    <>
      <iframe
        src={status.publicUrl ? `${status.publicUrl}#toolbar=0` : undefined}
        title="preview"
        className="border-border w-full flex-1 border"
      />
    </>
  );
};

export const PreviewPdfModal = ({
  renderId,
  open,
  onClose,
}: PreviewPdfModalProps) => {
  const t = useTranslations();
  const { data, isLoading, error } = useRenderStatus(renderId);

  if (!open) return null;

  return (
    <div
      className="bg-foreground/45 desktop:left-(--sidebar-width) animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="rounded-20 bg-card animate-scale-fade-in flex h-full w-full max-w-5xl flex-col gap-4 p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-4">
          <h2 className="type-h3 leading-snug tracking-tight">
            {t("keepsakes__preview_pdf__title")}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon width={20} height={20} />
          </Button>
        </div>
        <PreviewBody
          status={data}
          isLoading={isLoading || !renderId}
          error={error as Error | null}
        />
      </div>
    </div>
  );
};
