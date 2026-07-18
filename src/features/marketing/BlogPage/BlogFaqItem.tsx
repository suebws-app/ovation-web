interface BlogFaqItemProps {
  question: string;
  answer: string;
}

export const BlogFaqItem = ({ question, answer }: BlogFaqItemProps) => (
  <details className="border-border group rounded-12 open:border-primary/40 border p-5">
    <summary className="text-foreground type-body cursor-pointer list-none font-semibold marker:hidden">
      <span className="flex items-start justify-between gap-4">
        <span>{question}</span>
        <span
          aria-hidden
          className="text-muted-foreground shrink-0 transition group-open:rotate-45"
        >
          +
        </span>
      </span>
    </summary>
    <p className="text-muted-foreground type-body mt-3 leading-relaxed">
      {answer}
    </p>
  </details>
);
