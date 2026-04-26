import { cn } from "@ovation/ui/utils/cn";

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

export const FAQItem = ({
  question,
  answer,
  isOpen,
  onToggle,
}: FAQItemProps) => (
  <div className="border-border border-b py-5.5">
    <div
      className="flex cursor-pointer items-start justify-between gap-5"
      onClick={onToggle}
    >
      <span className="type-h3 font-serif leading-snug font-semibold">
        {question}
      </span>
      <button
        type="button"
        aria-expanded={isOpen}
        className={cn(
          "border-border flex size-7 shrink-0 items-center justify-center rounded-full border text-base font-semibold transition-transform",
          isOpen
            ? "border-primary bg-primary text-primary-foreground rotate-45"
            : "bg-background text-foreground",
        )}
      >
        +
      </button>
    </div>
    {isOpen && (
      <p className="text-muted-foreground type-body mt-3.5 max-w-160 leading-relaxed">
        {answer}
      </p>
    )}
  </div>
);
