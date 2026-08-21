type HeroLogoProps = {
  logoUrl: string;
  orgName: string;
  alt?: string;
};

export const HeroLogo = ({ logoUrl, orgName, alt }: HeroLogoProps) => (
  <div className="relative mx-auto aspect-square w-56">
    <div className="bg-card relative h-full w-full p-2.5 pb-9 shadow-lg">
      <div className="rounded-4 bg-muted/40 flex h-full w-full items-center justify-center overflow-hidden p-6">
        <img
          src={logoUrl}
          alt={alt ?? orgName}
          className="h-full w-full object-contain"
        />
      </div>
      <span className="text-muted-foreground type-caption absolute right-0 bottom-2.5 left-0 text-center font-serif italic">
        {orgName}
      </span>
    </div>
  </div>
);
