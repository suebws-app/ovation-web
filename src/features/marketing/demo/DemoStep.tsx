type DemoStepProps = {
  index: number;
  text: string;
};

export const DemoStep = ({ index, text }: DemoStepProps) => (
  <li className="flex items-start gap-3">
    <span className="bg-primary text-primary-foreground type-caption flex size-6 shrink-0 items-center justify-center rounded-full font-semibold">
      {index}
    </span>
    <span className="type-body text-muted-foreground leading-relaxed">
      {text}
    </span>
  </li>
);
