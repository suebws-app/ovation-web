interface UseCaseFaqItemProps {
  question: string;
  answer: string;
}

export const UseCaseFaqItem = ({ question, answer }: UseCaseFaqItemProps) => (
  <div>
    <dt className="type-body text-foreground font-semibold">{question}</dt>
    <dd className="text-muted-foreground type-body mt-2 leading-relaxed">
      {answer}
    </dd>
  </div>
);
