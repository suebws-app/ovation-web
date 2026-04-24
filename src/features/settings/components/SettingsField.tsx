type SettingsFieldProps = {
  label: string;
  value?: string;
  hint?: string;
  adornmentRight?: React.ReactNode;
  children?: React.ReactNode;
};

export const SettingsField = ({
  label,
  value,
  hint,
  adornmentRight,
  children,
}: SettingsFieldProps) => (
  <label className="block">
    <span className="mb-2 block type-caption font-semibold text-muted-foreground tracking-wide">
      {label}
    </span>
    {children ?? (
      <div className="flex items-center gap-2.5 rounded-12 border border-border bg-card px-3.5 py-3 type-body-small">
        <span className="flex-1">{value}</span>
        {adornmentRight}
      </div>
    )}
    {hint && (
      <span className="mt-1.5 block type-caption text-muted-foreground leading-relaxed">
        {hint}
      </span>
    )}
  </label>
);
