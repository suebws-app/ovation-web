type HowItWorksStepProps = {
  number: string;
  stepNumber: number;
  tag: string;
  title: string;
  body: string;
  illustration: React.ReactNode;
};

const STEP_COLORS: Record<number, string> = {
  1: "text-primary",
  2: "text-destructive",
  3: "text-secondary",
};

export const HowItWorksStep = ({
  number,
  stepNumber,
  tag,
  title,
  body,
  illustration,
}: HowItWorksStepProps) => {
  const colorClass = STEP_COLORS[stepNumber];
  return (
    <div className="bg-background border-border relative flex min-h-110 flex-col gap-5 overflow-hidden rounded-3xl border p-8">
      <div className="flex items-center justify-between">
        <span
          className={`type-h1 font-serif leading-none font-semibold italic ${colorClass}`}
        >
          {number}
        </span>
        <span className="text-muted-foreground bg-card border-border type-overline rounded-full border px-2.5 py-1.5 font-semibold tracking-wider uppercase">
          {tag}
        </span>
      </div>

      <div className="flex h-40 items-center justify-center">{illustration}</div>

      <div className="mt-auto">
        <h3 className="type-h2 font-serif font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-3 text-sm">{body}</p>
      </div>
    </div>
  );
};
