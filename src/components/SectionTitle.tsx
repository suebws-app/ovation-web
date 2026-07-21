import { cn } from "@ovation/ui/utils/cn";

type SectionTitleProps = {
  as?: "h1" | "h2" | "h3" | "blockquote";
  children: React.ReactNode;
  className?: string;
};

export const SectionTitle = ({
  as: Tag = "h2",
  children,
  className,
}: SectionTitleProps) => (
  <Tag
    className={cn(
      "landing-h1 tablet:landing-display leading-tight tracking-tight",
      className,
    )}
  >
    {children}
  </Tag>
);
