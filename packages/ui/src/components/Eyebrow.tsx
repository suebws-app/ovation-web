import { cn } from "../utils/cn";

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
};

export const Eyebrow = ({ children, className }: EyebrowProps) => (
  <p
    className={cn(
      "text-[11px] font-bold tracking-[2.2px] uppercase",
      className,
    )}
  >
    {children}
  </p>
);
