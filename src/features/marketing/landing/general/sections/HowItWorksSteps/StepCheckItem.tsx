import { CheckIcon } from "@ovation/icons/CheckIcon";

type StepCheckItemProps = {
  label: string;
};

export const StepCheckItem = ({ label }: StepCheckItemProps) => (
  <li className="flex items-start gap-3">
    <span className="bg-primary-soft/40 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
      <CheckIcon className="size-3" aria-hidden />
    </span>
    <span className="text-foreground type-body">{label}</span>
  </li>
);
