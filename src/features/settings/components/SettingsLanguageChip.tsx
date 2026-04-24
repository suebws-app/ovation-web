type SettingsLanguageChipProps = {
  flag: string;
  label: string;
};

export const SettingsLanguageChip = ({
  flag,
  label,
}: SettingsLanguageChipProps) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 type-caption font-semibold text-primary">
    <span className="type-body-small">{flag}</span>
    {label}
    <span className="cursor-pointer opacity-60">&times;</span>
  </span>
);
