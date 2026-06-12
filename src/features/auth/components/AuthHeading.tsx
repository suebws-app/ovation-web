import { Kicker } from "@ovation/ui/components/Kicker";

type AuthHeadingProps = {
  eyebrow?: string;
  title: string;
  titleEmphasis?: string;
  subtitle?: React.ReactNode;
};

export const AuthHeading = ({
  eyebrow,
  title,
  titleEmphasis,
  subtitle,
}: AuthHeadingProps) => (
  <div className="flex flex-col items-center text-center">
    {eyebrow && (
      <Kicker className="text-primary tablet:mb-2.5 mb-1.5">{eyebrow}</Kicker>
    )}
    <h1 className="type-h0 leading-[1.05] font-semibold tracking-tight">
      {title}
      {titleEmphasis && (
        <>
          <br />
          <span className="text-primary italic">{titleEmphasis}</span>
        </>
      )}
    </h1>
    {subtitle && (
      <p className="type-body-small text-muted-foreground mt-3 leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);
