import { InfoIcon } from "@ovation/icons/InfoIcon";

type InfoHintProps = {
  label: string;
};

export const InfoHint = ({ label }: InfoHintProps) => (
  <span className="group relative inline-flex items-center align-middle">
    <button
      type="button"
      aria-label={label}
      className="text-muted-foreground hover:text-foreground inline-flex cursor-help"
    >
      <InfoIcon className="size-3.5" />
    </button>
    <span
      role="tooltip"
      className="bg-foreground text-background type-caption rounded-8 pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 w-48 -translate-x-1/2 px-2.5 py-1.5 text-center opacity-0 shadow-lg transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
    >
      {label}
    </span>
  </span>
);
