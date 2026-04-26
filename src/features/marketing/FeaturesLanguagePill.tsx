type FeaturesLanguagePillProps = {
  text: string;
};

export const FeaturesLanguagePill = ({ text }: FeaturesLanguagePillProps) => (
  <span className="border-border bg-card type-overline rounded-full border px-2.5 py-1.5 font-medium">
    {text}
  </span>
);
