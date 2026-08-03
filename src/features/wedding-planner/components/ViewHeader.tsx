type ViewHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export const ViewHeader = ({ title, subtitle, action }: ViewHeaderProps) => (
  <div className="tablet:flex-row tablet:items-end tablet:justify-between mb-6 flex flex-col gap-3">
    <div>
      <h1 className="type-h1">{title}</h1>
      {subtitle ? (
        <p className="type-body-small text-muted-foreground mt-1.5">
          {subtitle}
        </p>
      ) : null}
    </div>
    {action ? <div className="flex items-center gap-2">{action}</div> : null}
  </div>
);
