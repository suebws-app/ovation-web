type HeroAvatarCircleProps = {
  initials: string;
  bg: string;
  overlap: boolean;
};

export const HeroAvatarCircle = ({
  initials,
  bg,
  overlap,
}: HeroAvatarCircleProps) => (
  <div
    className={`border-background text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full border-2 font-serif text-sm font-semibold ${bg} ${overlap ? "-ml-2.5" : ""}`}
  >
    {initials}
  </div>
);
