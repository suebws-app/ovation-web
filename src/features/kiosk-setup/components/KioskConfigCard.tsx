type KioskConfigCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export const KioskConfigCard = ({
  title,
  description,
  children,
}: KioskConfigCardProps) => (
  <div className="rounded-16 border border-border bg-card px-7">
    <div className="border-b border-border py-4">
      <div className="font-serif type-h3 font-semibold">{title}</div>
      <div className="mt-0.5 type-caption text-muted-foreground">
        {description}
      </div>
    </div>
    {children}
  </div>
);
