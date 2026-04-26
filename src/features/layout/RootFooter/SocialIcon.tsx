type SocialIconProps = {
  label: string;
};

export const SocialIcon = ({ label }: SocialIconProps) => (
  <div className="border-border text-muted-foreground flex size-9 items-center justify-center rounded-full border text-xs font-bold">
    {label}
  </div>
);
