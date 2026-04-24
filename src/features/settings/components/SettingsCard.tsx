type SettingsCardProps = {
  children: React.ReactNode;
  className?: string;
};

export const SettingsCard = ({ children, className }: SettingsCardProps) => (
  <div className={`rounded-16 border border-border bg-card px-7 ${className ?? ""}`}>
    {children}
  </div>
);
