"use client";

import { Button } from "@ovation/ui/components/Button";
import { Warning } from "@ovation/icons/Warning";
import { Check } from "@ovation/icons/Check";
import { DeleteWarningItem } from "./DeleteWarningItem";

type DeleteBookModalProps = {
  onClose: () => void;
};

const WARNINGS = [
  "Guests will no longer be able to view or resubmit messages",
  "Your ovation.love/lena-and-tomas URL will become available again",
  "We keep encrypted data for 30 days for recovery \u2014 after that, it\u2019s gone",
];

export const DeleteBookModal = ({ onClose }: DeleteBookModalProps) => {
  return (
    <div className="bg-foreground/45 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="rounded-20 bg-card w-full max-w-lg p-9 shadow-lg">
        <div className="rounded-16 bg-destructive/15 mb-4.5 flex size-14 items-center justify-center">
          <Warning width={26} height={26} className="text-destructive" />
        </div>
        <h2 className="type-h2 font-serif leading-snug tracking-tight">
          Delete{" "}
          <span className="italic">&ldquo;Lena &amp; Tom&aacute;s&rdquo;</span>?
        </h2>
        <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
          This will permanently erase{" "}
          <strong className="text-foreground">142 messages</strong> from{" "}
          <strong className="text-foreground">88 guests</strong>, all audio,
          photos, and your Gold Book draft. This cannot be undone.
        </p>

        <div className="rounded-12 border-destructive/20 bg-destructive/5 mt-4.5 border p-4">
          {WARNINGS.map((warning) => (
            <DeleteWarningItem key={warning} text={warning} />
          ))}
        </div>

        <div className="mt-5.5">
          <span className="type-caption text-muted-foreground mb-2 block">
            Type{" "}
            <strong className="text-foreground font-mono">
              delete lena and tom&aacute;s
            </strong>{" "}
            to confirm
          </span>
          <div className="rounded-12 border-destructive bg-background type-body-small border-2 p-3 font-mono shadow-[0_0_0_4px_var(--destructive)/10]">
            delete lena and tom
            <span className="bg-destructive ml-0.5 inline-block h-4 w-0.5 animate-pulse align-middle" />
          </div>
        </div>

        <label className="type-body-small text-muted-foreground mt-3.5 flex items-start gap-2.5">
          <span className="rounded-4 bg-destructive text-primary-foreground mt-0.5 flex size-4.5 shrink-0 items-center justify-center">
            <Check width={11} height={11} strokeWidth={3} />
          </span>
          I&apos;ve exported my data and understand this is permanent.
        </label>

        <div className="mt-6.5 flex justify-end gap-2.5">
          <Button variant="outline" className="rounded-full" onClick={onClose}>
            Keep the book
          </Button>
          <Button variant="destructive" className="rounded-full">
            Delete permanently
          </Button>
        </div>
      </div>
    </div>
  );
};
