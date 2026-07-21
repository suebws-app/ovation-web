type ShowcaseBulletProps = {
  children: React.ReactNode;
};

export const ShowcaseBullet = ({ children }: ShowcaseBulletProps) => (
  <li className="landing-body text-foreground flex items-center gap-3">
    <span className="text-primary text-lg leading-none">✦</span>
    <span>{children}</span>
  </li>
);
