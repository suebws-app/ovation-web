type SettingsFieldProps = {
  label: string;
  value?: string;
  hint?: string;
  adornmentRight?: React.ReactNode;
  children?: React.ReactNode;
  fieldName?: string;
};

export const SettingsField = ({
  label,
  value,
  hint,
  adornmentRight,
  children,
  fieldName,
}: SettingsFieldProps) => (
  <label className="block" data-field={fieldName}>
    <span className="type-caption text-muted-foreground mb-2 block font-semibold tracking-wide">
      {label}
    </span>
    {children ?? (
      <div className="border-border bg-background type-body-small flex h-10 items-center gap-2.5 rounded-lg border px-3">
        <span className="flex-1 truncate">{value}</span>
        {adornmentRight}
      </div>
    )}
    {hint && (
      <span className="type-caption text-muted-foreground mt-1.5 block leading-relaxed">
        {hint}
      </span>
    )}
  </label>
);
