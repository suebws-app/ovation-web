type SettingsSectionTitleProps = {
  title: string;
  description?: string;
};

export const SettingsSectionTitle = ({
  title,
  description,
}: SettingsSectionTitleProps) => (
  <div>
    <h2 className="tablet:type-h2 type-h3 tracking-tight">{title}</h2>
    {description && (
      <p className="type-body-small text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
        {description}
      </p>
    )}
  </div>
);
