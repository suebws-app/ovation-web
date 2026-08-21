import { type ComponentType, type SVGProps } from "react";

type FeatureGridCardProps = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

export const FeatureGridCard = ({
  Icon,
  title,
  description,
}: FeatureGridCardProps) => (
  <div className="border-border bg-card rounded-16 flex flex-col border p-5">
    <div className="flex items-center gap-3">
      <span className="bg-primary-soft/40 text-primary rounded-8 flex size-9 shrink-0 items-center justify-center">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="landing-h4 text-foreground">{title}</h3>
    </div>
    <p className="text-muted-foreground type-body mt-4">{description}</p>
  </div>
);
