type SettingsSectionTitleProps = {
  title: string;
  description?: string;
};

export const SettingsSectionTitle = ({
  title,
  description,
}: SettingsSectionTitleProps) => (
  <div className="mb-5">
    <h2 className="font-serif type-h2 tracking-tight">{title}</h2>
    {description && (
      <p className="mt-1.5 max-w-xl type-body-small text-muted-foreground leading-relaxed">
        {description}
      </p>
    )}
  </div>
);
