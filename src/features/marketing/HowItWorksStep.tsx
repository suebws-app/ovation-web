import { StepCard } from "@ovation/ui/components/StepCard";

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
}: HowItWorksStepProps) => (
  <StepCard
    number={number}
    numberClassName={STEP_COLORS[stepNumber]}
    tag={tag}
    title={title}
    body={body}
    illustration={illustration}
  />
);
