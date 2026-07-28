import { SparkleIcon } from "@ovation/icons/SparkleIcon";

type AiSuggestionChipProps = {
  label: string;
  onClick: () => void;
};

export const AiSuggestionChip = ({ label, onClick }: AiSuggestionChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className="border-border bg-card hover:border-primary/40 type-caption flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors"
  >
    <SparkleIcon width={13} height={13} className="text-primary" />
    {label}
  </button>
);
