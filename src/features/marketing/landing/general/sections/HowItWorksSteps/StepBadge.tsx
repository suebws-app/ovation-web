type StepBadgeProps = {
  number: number;
  label: string;
};

export const StepBadge = ({ number, label }: StepBadgeProps) => (
  <div className="flex items-center gap-2.5">
    <span className="bg-primary text-primary-foreground type-caption flex size-6 items-center justify-center rounded-full font-semibold">
      {number}
    </span>
    <span className="text-primary type-body-small font-semibold">{label}</span>
  </div>
);
