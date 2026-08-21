import { type ReactNode } from "react";
import { ComparisonItem } from "./ComparisonItem";

type ComparisonColumnProps = {
  heading: ReactNode;
  items: string[];
  isPositive: boolean;
};

export const ComparisonColumn = ({
  heading,
  items,
  isPositive,
}: ComparisonColumnProps) => (
  <div className="flex flex-col items-center">
    <div className="flex flex-col items-center">
      <h3 className="flex h-9 items-center justify-center">{heading}</h3>
      <ul className="mt-6 flex w-fit flex-col gap-3.5">
        {items.map((item) => (
          <ComparisonItem key={item} label={item} isPositive={isPositive} />
        ))}
      </ul>
    </div>
  </div>
);
