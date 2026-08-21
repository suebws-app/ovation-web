import { cn } from "@ovation/ui/utils/cn";

type MemoryColumnProps = {
  icon: React.ReactNode;
  iconWrapClassName: string;
  title: string;
  description: string;
  className?: string;
};

export const MemoryColumn = ({
  icon,
  iconWrapClassName,
  title,
  description,
  className,
}: MemoryColumnProps) => (
  <div
    className={cn(
      "border-border tablet:border-r tablet:border-b-0 border-b py-11 last:border-r-0 last:border-b-0",
      className,
    )}
  >
    <div
      className={cn(
        "rounded-12 mb-5 flex size-12 items-center justify-center",
        iconWrapClassName,
      )}
    >
      {icon}
    </div>
    <h3 className="landing-h3 text-foreground">{title}</h3>
    <p className="landing-body text-muted-foreground mt-2.5">{description}</p>
  </div>
);
