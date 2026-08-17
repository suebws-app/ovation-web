import { StepCheckItem } from "./StepCheckItem";

type StepChecklistProps = {
  items: string[];
};

export const StepChecklist = ({ items }: StepChecklistProps) => (
  <ul className="mt-6 flex flex-col gap-3">
    {items.map((item) => (
      <StepCheckItem key={item} label={item} />
    ))}
  </ul>
);
