import { FooterLink } from "./FooterLink";

type FooterColumnProps = {
  col: { title: string; links: string[] };
};

export const FooterColumn = ({ col }: FooterColumnProps) => (
  <div>
    <div className="text-muted-foreground type-overline mb-3.5 font-bold tracking-widest uppercase">
      {col.title}
    </div>
    <div className="flex flex-col gap-2.5">
      {col.links.map((link) => (
        <FooterLink key={link} link={link} />
      ))}
    </div>
  </div>
);
