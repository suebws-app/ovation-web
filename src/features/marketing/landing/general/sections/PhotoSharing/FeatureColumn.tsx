import { type ComponentType, type SVGProps } from "react";
import { FeatureCell } from "./FeatureCell";

type FeatureColumnItem = {
  key: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

type FeatureColumnProps = {
  items: FeatureColumnItem[];
};

export const FeatureColumn = ({ items }: FeatureColumnProps) => (
  <div className="tablet:gap-16 flex flex-col items-center gap-10">
    {items.map((item) => (
      <FeatureCell
        key={item.key}
        Icon={item.Icon}
        title={item.title}
        description={item.description}
      />
    ))}
  </div>
);
