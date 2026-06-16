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
