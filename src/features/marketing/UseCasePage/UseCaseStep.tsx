interface UseCaseStepProps {
  index: number;
  text: string;
}

export const UseCaseStep = ({ index, text }: UseCaseStepProps) => (
  <li className="flex items-start gap-4">
    <span className="bg-primary/10 text-primary type-body-small flex size-8 shrink-0 items-center justify-center rounded-full font-semibold">
      {index}
    </span>
    <span className="text-foreground type-body leading-relaxed">{text}</span>
  </li>
);
