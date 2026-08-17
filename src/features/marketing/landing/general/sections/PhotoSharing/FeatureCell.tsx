import { type ComponentType, type SVGProps } from "react";

type FeatureCellProps = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

export const FeatureCell = ({ Icon, title, description }: FeatureCellProps) => (
  <div className="flex flex-col items-center text-center">
    <span className="bg-primary-soft/40 text-primary flex size-13 items-center justify-center rounded-full">
      <Icon className="size-6" aria-hidden />
    </span>
    <h3 className="landing-h4 text-foreground mt-5">{title}</h3>
    <p className="text-muted-foreground type-body mt-2 max-w-80">
      {description}
    </p>
  </div>
);
