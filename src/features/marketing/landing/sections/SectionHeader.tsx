import { cn } from "@ovation/ui/utils/cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
  as?: "h2" | "h3";
};

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  className,
  as: Tag = "h2",
}: SectionHeaderProps) => (
  <div className={cn("mx-auto mb-14 max-w-180 text-center", className)}>
    {eyebrow && <p className="landing-eyebrow text-primary mb-4">{eyebrow}</p>}
    <Tag className="landing-h1 tablet:landing-display text-foreground">
      {title}
    </Tag>
    {description && (
      <p className="landing-body-large text-muted-foreground mx-auto mt-4 max-w-160">
        {description}
      </p>
    )}
  </div>
);
